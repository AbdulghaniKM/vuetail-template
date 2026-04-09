import fs from 'fs';
import path from 'path';
import readline from 'readline';

const REGISTRY_BASE = 'https://raw.githubusercontent.com/AbdulghaniKM/vuetail-components/main';
const REGISTRY_INDEX = `${REGISTRY_BASE}/registry.json`;

const args = process.argv.slice(2);
const isComposable = args.includes('--composable');
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

const prompt = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });

// ─── recursive dep collector ─────────────────────────────────────────────────
// Walks the dep tree and returns all missing items (excluding the root itself).

const collectMissing = (name, depMap, visited = new Set()) => {
  const missing = { components: new Set(), composables: new Set() };

  const walk = (n) => {
    if (visited.has(n)) return;
    visited.add(n);

    const deps = depMap[n] ?? [];
    for (const dep of deps) {
      if (!isInstalled(dep)) {
        isComposableName(dep)
          ? missing.composables.add(dep)
          : missing.components.add(dep);
      }
      walk(dep);
    }
  };

  walk(name);
  return missing;
};

// ─── install a single item (no dep checking — already resolved) ───────────────

const installItem = async (name) => {
  const url = `${REGISTRY_BASE}/${registryFilePath(name)}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`  ✗ Failed to fetch ${name} (${response.status})`);
    return false;
  }
  const dest = localFilePath(name);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, await response.text());
  const rel = path.relative(process.cwd(), dest).replace(/\\/g, '/');
  console.log(`  ✓ ${rel}`);
  return true;
};

// ─── commands ────────────────────────────────────────────────────────────────

const showHelp = () => {
  console.log(`
  vuetail add — on-demand component fetcher

  Usage:
    pnpm add-component <ComponentName>    Add a UI component
    pnpm add-composable <name>            Add a composable
    pnpm add-component list               List available components
    pnpm add-composable list              List available composables

  Examples:
    pnpm add-component AppButton
    pnpm add-component AppModal
    pnpm add-composable useToast
`);
};

const listCommand = async () => {
  const res = await fetch(REGISTRY_INDEX);
  if (!res.ok) {
    console.log('No registry index found. Browse the repo directly:');
    console.log('  https://github.com/AbdulghaniKM/vuetail-components');
    return;
  }
  const index = await res.json();
  const items = isComposable ? index.composables : index.components;
  const label = isComposable ? 'composables' : 'components';
  if (!items?.length) {
    console.log(`No ${label} in registry yet.`);
    return;
  }
  console.log(`\nAvailable ${label}:\n`);
  items.forEach((name) => {
    const installed = isInstalled(name);
    console.log(`  ${installed ? '✓' : '·'} ${name}${installed ? ' (installed)' : ''}`);
  });
  console.log('');
};

const addCommand = async (name) => {
  // 1. Fetch registry index for dep map
  const res = await fetch(REGISTRY_INDEX);
  if (!res.ok) {
    console.warn('  ! Could not fetch registry index — skipping dep check.');
  }
  const registry = res.ok ? await res.json() : {};
  const depMap = registry.dependencies ?? {};

  // 2. Collect all missing transitive deps (excluding the item itself)
  const missing = collectMissing(name, depMap);
  const missingComponents = [...missing.components];
  const missingComposables = [...missing.composables];
  const totalMissing = missingComponents.length + missingComposables.length;

  // 3. Warn + prompt if anything is missing
  if (totalMissing > 0) {
    console.log(`\n  ⚠  ${name} requires ${totalMissing} item${totalMissing > 1 ? 's' : ''} that aren't installed:\n`);
    if (missingComponents.length) {
      console.log(`     Components : ${missingComponents.join(', ')}`);
    }
    if (missingComposables.length) {
      console.log(`     Composables: ${missingComposables.join(', ')}`);
    }
    console.log('');

    const answer = await prompt('  Install missing dependencies? [Y/n]: ');
    if (answer === 'n' || answer === 'no') {
      console.log('\n  Skipped. Installing only the requested component — it may not work correctly.\n');
    } else {
      console.log('\n  Installing dependencies...');
      for (const dep of [...missingComponents, ...missingComposables]) {
        await installItem(dep);
      }
      console.log('');
    }
  }

  // 4. Install the requested item
  console.log(`  Installing ${name}...`);
  await installItem(name);
  console.log('');
};

// ─── entry ───────────────────────────────────────────────────────────────────

if (!command || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (command === 'list') {
  await listCommand();
  process.exit(0);
}

await addCommand(command);
