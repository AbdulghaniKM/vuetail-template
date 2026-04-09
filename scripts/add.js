import fs from 'fs';
import path from 'path';

const REGISTRY_BASE = 'https://raw.githubusercontent.com/AbdulghaniKM/vuetail-components/main';
const REGISTRY_INDEX = `${REGISTRY_BASE}/registry.json`;

const args = process.argv.slice(2);
const isComposable = args.includes('--composable');
const positional = args.filter((a) => !a.startsWith('--'));
const command = positional[0];

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

if (!command || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (command === 'list') {
  try {
    const res = await fetch(REGISTRY_INDEX);
    if (!res.ok) {
      console.log('No registry index found. Browse the repo directly:');
      console.log('  https://github.com/AbdulghaniKM/vuetail-components');
      process.exit(0);
    }
    const index = await res.json();
    const items = isComposable ? index.composables : index.components;
    const label = isComposable ? 'composables' : 'components';
    if (!items?.length) {
      console.log(`No ${label} in registry yet.`);
    } else {
      console.log(`\nAvailable ${label}:\n`);
      items.forEach((name) => console.log(`  • ${name}`));
      console.log('');
    }
  } catch {
    console.error('Failed to fetch registry index.');
    process.exit(1);
  }
  process.exit(0);
}

const fileName = isComposable ? `${command}.ts` : `${command}.vue`;
const registryPath = isComposable ? `composables/${fileName}` : `components/ui/${fileName}`;
const localPath = isComposable
  ? path.join(process.cwd(), 'src', 'composables', fileName)
  : path.join(process.cwd(), 'src', 'components', 'ui', fileName);

const url = `${REGISTRY_BASE}/${registryPath}`;

console.log(`Fetching ${fileName}...`);

const response = await fetch(url);
if (!response.ok) {
  console.error(`Not found in registry: ${url}`);
  console.error(`Run 'pnpm add-${isComposable ? 'composable' : 'component'} list' to see what's available.`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(localPath), { recursive: true });
fs.writeFileSync(localPath, await response.text());

const rel = `src/${isComposable ? 'composables' : 'components/ui'}/${fileName}`;
console.log(`✓ ${rel}`);
