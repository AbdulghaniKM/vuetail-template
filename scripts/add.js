import fs from 'fs';
import path from 'path';

const REGISTRY_BASE = 'https://raw.githubusercontent.com/AbdulghaniKM/vuetail-components/main';
const REGISTRY_INDEX = `${REGISTRY_BASE}/registry.json`;

const args = process.argv.slice(2);
const isComposable = args.includes('--composable');
const noDeps = args.includes('--no-deps');
const positional = args.filter((a) => !a.startsWith('--'));
const command = positional[0];

// ─── helpers ────────────────────────────────────────────────────────────────

const isComposableName = (name) => name.startsWith('use');

const localFilePath = (name) => {
  if (isComposableName(name)) {
    return path.join(process.cwd(), 'src', 'composables', `${name}.ts`);
  }
  return path.join(process.cwd(), 'src', 'components', 'ui', `${name}.vue`);
};

const registryFilePath = (name) => {
  if (isComposableName(name)) return `composables/${name}.ts`;
  return `components/ui/${name}.vue`;
};

const isInstalled = (name) => fs.existsSync(localFilePath(name));

// ─── recursive dep collector ─────────────────────────────────────────────────

const collectMissing = (name, depMap, visited = new Set()) => {
  const missing = [];
  const walk = (n) => {
    if (visited.has(n)) return;
    visited.add(n);
    for (const dep of depMap[n] ?? []) {
      if (!isInstalled(dep)) missing.push(dep);
      walk(dep);
    }
  };
  walk(name);
  return [...new Set(missing)];
};

// ─── install a single file ───────────────────────────────────────────────────

const installItem = async (name) => {
  const url = `${REGISTRY_BASE}/${registryFilePath(name)}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.log(`  ✗ ${name} — not found in registry (${response.status})`);
    return false;
  }
  const dest = localFilePath(name);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, await response.text(), 'utf8');
  const label = isComposableName(name)
    ? `src/composables/${name}.ts`
    : `src/components/ui/${name}.vue`;
  console.log(`  ✓ ${label}`);
  return true;
};

// ─── commands ────────────────────────────────────────────────────────────────

const showHelp = () => {
  console.log(`
  vuetail — on-demand component fetcher

  Usage:
    pnpm add-component <Name>          Add a UI component (+ its deps)
    pnpm add-composable <name>         Add a composable (+ its deps)
    pnpm add-component list            List available components
    pnpm add-composable list           List available composables

  Flags:
    --no-deps    Skip automatic dependency installation

  Examples:
    pnpm add-component AppButton
    pnpm add-component AppModal
    pnpm add-composable useToast
    pnpm add-component ConfirmDangerModal --no-deps
`);
};

const listCommand = async () => {
  const res = await fetch(REGISTRY_INDEX);
  if (!res.ok) {
    console.log('Registry index not found. Browse directly:');
    console.log('  https://github.com/AbdulghaniKM/vuetail-components');
    return;
  }
  const index = await res.json();
  const items = isComposable ? index.composables : index.components;
  const label = isComposable ? 'composables' : 'components';
  if (!items?.length) { console.log(`No ${label} in registry yet.`); return; }
  console.log(`\nAvailable ${label}:\n`);
  items.forEach((name) => console.log(`  ${isInstalled(name) ? '✓' : '·'} ${name}`));
  console.log('');
};

const addCommand = async (name) => {
  // fetch registry for dep map
  const res = await fetch(REGISTRY_INDEX);
  const depMap = res.ok ? ((await res.json()).dependencies ?? {}) : {};

  if (!res.ok) {
    console.log('  ! Registry index unavailable — skipping dep check.');
  }

  // collect all missing transitive deps
  const missing = noDeps ? [] : collectMissing(name, depMap);

  if (missing.length > 0) {
    const components = missing.filter((d) => !isComposableName(d));
    const composables = missing.filter((d) => isComposableName(d));
    console.log(`\n  Installing ${name} + ${missing.length} missing dep${missing.length > 1 ? 's' : ''}:\n`);
    if (components.length) console.log(`  Components : ${components.join(', ')}`);
    if (composables.length) console.log(`  Composables: ${composables.join(', ')}`);
    console.log('');
    for (const dep of missing) await installItem(dep);
    console.log('');
  }

  await installItem(name);
  console.log('');
};

// ─── entry ───────────────────────────────────────────────────────────────────

if (!command || command === '--help' || command === '-h') { showHelp(); process.exit(0); }
if (command === 'list') { await listCommand(); process.exit(0); }
await addCommand(command);
