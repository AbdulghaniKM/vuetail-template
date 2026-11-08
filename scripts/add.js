import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';
import { fileURLToPath } from 'url';

const REGISTRY_REPO = 'AbdulghaniKM/vuetail-components';
const DEFAULT_REF = 'main';
const LOCKFILE = 'vuetail.json';
const LOCKFILE_VERSION = 1;
const FETCH_TIMEOUT_MS = 15_000;
const FETCH_RETRIES = 2;

// ─── args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isComposable = args.includes('--composable');
const noDeps = args.includes('--no-deps');
const force = args.includes('--force');
const refIdx = args.findIndex((a) => a === '--ref' || a.startsWith('--ref='));
let ref = DEFAULT_REF;
if (refIdx !== -1) {
  ref = args[refIdx].includes('=') ? args[refIdx].split('=')[1] : args[refIdx + 1];
}
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--ref');
const command = positional[0];

const REGISTRY_BASE = `https://raw.githubusercontent.com/${REGISTRY_REPO}/${ref}`;
const REGISTRY_INDEX = `${REGISTRY_BASE}/registry.json`;

// ─── paths ───────────────────────────────────────────────────────────────────

const isComposableName = (name) => /^use[A-Z]/.test(name);
// Stylesheets are keyed `styles/<name>` in vuetail.json, so they never collide with components.
const STYLE_PREFIX = 'styles/';
const isStyleName = (name) => name.startsWith(STYLE_PREFIX);

const localFilePath = (name) => {
  if (isStyleName(name)) return path.join(process.cwd(), 'src', `${name}.css`);
  if (isComposableName(name)) {
    return path.join(process.cwd(), 'src', 'composables', `${name}.ts`);
  }
  return path.join(process.cwd(), 'src', 'components', 'ui', `${name}.vue`);
};

const registryFilePath = (name) => {
  if (isStyleName(name)) return `${name}.css`;
  if (isComposableName(name)) return `composables/${name}.ts`;
  return `components/ui/${name}.vue`;
};

const isInstalled = (name) => fs.existsSync(localFilePath(name));

const relativeLabel = (p) => path.relative(process.cwd(), p).replace(/\\/g, '/');

// ─── lockfile (vuetail.json) ─────────────────────────────────────────────────

const lockfilePath = () => path.join(process.cwd(), LOCKFILE);

const readLockfile = () => {
  try {
    return JSON.parse(fs.readFileSync(lockfilePath(), 'utf8'));
  } catch {
    return { version: LOCKFILE_VERSION, ref, installed: {} };
  }
};

const writeLockfile = (lock) => {
  fs.writeFileSync(lockfilePath(), JSON.stringify(lock, null, 2) + '\n', 'utf8');
};

// Line endings are normalised first: a CRLF checkout of an untouched file is not an edit.
const sha256 = (text) =>
  crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');

// ─── fetch with timeout + retry ──────────────────────────────────────────────

const fetchWithRetry = async (url, { attempts = FETCH_RETRIES + 1 } = {}) => {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
      }
    }
  }
  throw lastErr;
};

// ─── prompt (TTY only) ───────────────────────────────────────────────────────

const promptYesNo = (question) => {
  if (!process.stdin.isTTY) return Promise.resolve(false);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${question} [y/N] `, (answer) => {
      rl.close();
      resolve(/^y(es)?$/i.test(answer.trim()));
    });
  });
};

// ─── dep walking ─────────────────────────────────────────────────────────────

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

// ─── template file requirements ──────────────────────────────────────────────
// Walks `requires.files` for every item being installed, aggregates the set,
// and returns only the ones missing from the consumer's working directory.
const collectMissingFiles = (names, requiresMap) => {
  const required = new Set();
  for (const n of names) {
    for (const f of requiresMap[n]?.files ?? []) required.add(f);
  }
  return [...required].filter((f) => !fs.existsSync(path.join(process.cwd(), f)));
};

// ─── npm package requirements ────────────────────────────────────────────────
// `requires.packages` entries are a name, or `name@range` when a version matters
// (`motion-v@^2.2.1`: 1.x flashes motion elements at the end of an animation).
// The CLI does not install packages; it names the ones package.json lacks.
export const parsePackageSpec = (spec) => {
  const at = spec.lastIndexOf('@');
  return at > 0
    ? { name: spec.slice(0, at), range: spec.slice(at + 1) }
    : { name: spec, range: null };
};

export const collectMissingPackages = (names, requiresMap, pkg) => {
  const have = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };
  const specs = new Map();
  for (const n of names) {
    for (const spec of requiresMap[n]?.packages ?? []) {
      const { name } = parsePackageSpec(spec);
      if (!(name in have)) specs.set(name, spec);
    }
  }
  return [...specs.values()];
};

const readPackageJson = () => {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  } catch {
    return null;
  }
};

// ─── install ─────────────────────────────────────────────────────────────────

const installItem = async (name, lock) => {
  const url = `${REGISTRY_BASE}/${registryFilePath(name)}`;
  let response;
  try {
    response = await fetchWithRetry(url);
  } catch (err) {
    console.log(`  ✗ ${name} — network error: ${err.message}`);
    return false;
  }
  if (!response.ok) {
    console.log(`  ✗ ${name} — not found in registry (${response.status})`);
    return false;
  }

  const text = await response.text();
  const newSha = sha256(text);
  const dest = localFilePath(name);
  const record = lock.installed[name];

  // Overwrite protection: a file on disk that matches neither the incoming version nor the
  // last-installed SHA has local edits (or came with the template, unrecorded). Require
  // --force or an interactive y/N.
  if (!force && fs.existsSync(dest)) {
    const currentSha = sha256(fs.readFileSync(dest, 'utf8'));
    if (currentSha !== newSha && currentSha !== record?.sha) {
      console.log(`  ! ${name} — local file differs from last-installed version.`);
      const ok = await promptYesNo(`    Overwrite local changes to ${name}?`);
      if (!ok) {
        console.log(`    ↷ skipped (use --force to overwrite).`);
        return false;
      }
    }
  }

  // Atomic write: temp file + rename
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tmp = `${dest}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, text, 'utf8');
  fs.renameSync(tmp, dest);

  lock.installed[name] = {
    sha: newSha,
    ref,
    installedAt: new Date().toISOString(),
  };

  console.log(`  ✓ ${relativeLabel(dest)}`);
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
    pnpm add-component styles          Add or update the design tokens (src/styles/tokens.css)
    pnpm add-component verify          Verify installed files match recorded SHAs

  Flags:
    --no-deps          Skip automatic dependency installation
    --ref <sha|tag>    Fetch from a specific commit, tag, or branch (default: main)
    --force            Overwrite local changes without prompting

  Examples:
    pnpm add-component AppButton
    pnpm add-component AppModal --ref v0.3.0
    pnpm add-composable useToast
    pnpm add-component AppButton --force
`);
};

const listCommand = async () => {
  let res;
  try {
    res = await fetchWithRetry(REGISTRY_INDEX);
  } catch (err) {
    console.log(`Registry unreachable: ${err.message}`);
    return;
  }
  if (!res.ok) {
    console.log('Registry index not found. Browse directly:');
    console.log(`  https://github.com/${REGISTRY_REPO}`);
    return;
  }
  const index = await res.json();
  const items = isComposable ? index.composables : index.components;
  const label = isComposable ? 'composables' : 'components';
  if (!items?.length) {
    console.log(`No ${label} in registry yet.`);
    return;
  }
  console.log(`\nAvailable ${label} (ref: ${ref}):\n`);
  items.forEach((name) => console.log(`  ${isInstalled(name) ? '✓' : '·'} ${name}`));
  console.log('');
};

const verifyCommand = async () => {
  const lock = readLockfile();
  const entries = Object.entries(lock.installed ?? {});
  if (!entries.length) {
    console.log('No installed items recorded in vuetail.json.');
    return 0;
  }
  let drift = 0;
  for (const [name, rec] of entries) {
    const p = localFilePath(name);
    if (!fs.existsSync(p)) {
      console.log(`  ✗ ${name} — missing on disk`);
      drift++;
      continue;
    }
    const sha = sha256(fs.readFileSync(p, 'utf8'));
    if (sha !== rec.sha) {
      console.log(`  ! ${name} — drift (expected ${rec.sha.slice(0, 8)}, got ${sha.slice(0, 8)})`);
      drift++;
    } else {
      console.log(`  ✓ ${name}`);
    }
  }
  console.log(`\n${drift === 0 ? 'All files match.' : `${drift} drifted / missing.`}`);
  return drift === 0 ? 0 : 1;
};

const warnMainRef = () => {
  if (ref === 'main') {
    console.log(`  ! Using ref 'main' — output is not reproducible. Pin with --ref <tag|sha>.\n`);
  }
};

const fetchIndex = async () => {
  let res;
  try {
    res = await fetchWithRetry(REGISTRY_INDEX);
  } catch (err) {
    throw new Error(`Registry unreachable: ${err.message}`);
  }
  return { ok: res.ok, index: res.ok ? await res.json() : {} };
};

const styleNames = (index) => (index.styles ?? []).map((s) => `${STYLE_PREFIX}${s}`);

const stylesCommand = async () => {
  warnMainRef();
  const { ok, index } = await fetchIndex();
  if (!ok) throw new Error('Registry index unavailable.');
  const names = styleNames(index);
  if (!names.length) {
    console.log('No styles in registry.');
    return 0;
  }
  const lock = readLockfile();
  lock.version = LOCKFILE_VERSION;
  lock.ref = ref;
  lock.installed = lock.installed ?? {};
  console.log('');
  let failed = 0;
  for (const name of names) if (!(await installItem(name, lock))) failed++;
  writeLockfile(lock);
  console.log('');
  return failed ? 1 : 0;
};

// Components are written against the tokens of the same ref. Say so when the local tokens are
// missing or differ, so a class that resolves to nothing is not a silent surprise.
const checkStyles = async (index, lock) => {
  for (const name of styleNames(index)) {
    const dest = localFilePath(name);
    const label = relativeLabel(dest);
    if (!fs.existsSync(dest)) {
      console.log(`  ! ${label} is missing; components need it. Run: pnpm add-component styles`);
      continue;
    }
    let res;
    try {
      res = await fetchWithRetry(`${REGISTRY_BASE}/${registryFilePath(name)}`);
    } catch {
      continue;
    }
    if (!res.ok) continue;
    const remoteSha = sha256(await res.text());
    const localSha = sha256(fs.readFileSync(dest, 'utf8'));
    if (localSha === remoteSha) continue;
    const untouched = lock.installed?.[name]?.sha === localSha;
    console.log(
      untouched
        ? `  ! ${label} is older than '${ref}'. Update: pnpm add-component styles --ref ${ref}`
        : `  ! ${label} differs from '${ref}' (local edits?). Review: pnpm add-component styles --ref ${ref}`,
    );
  }
};

const addCommand = async (name) => {
  warnMainRef();
  const { ok, index } = await fetchIndex();
  const depMap = index.dependencies ?? {};
  const requiresMap = index.requires ?? {};
  if (!ok) {
    console.log('  ! Registry index unavailable — skipping dep check.');
  }

  const lock = readLockfile();
  lock.version = LOCKFILE_VERSION;
  lock.ref = ref;
  lock.installed = lock.installed ?? {};

  const missing = noDeps ? [] : collectMissing(name, depMap);

  // Check that every template file the item(s) need is present BEFORE we
  // fetch anything. No schema validator, just existence of relative paths.
  const allToInstall = [name, ...missing];
  const missingFiles = collectMissingFiles(allToInstall, requiresMap);
  if (missingFiles.length > 0) {
    console.log(`\n  ✗ ${name} requires template files that are missing:\n`);
    for (const f of missingFiles) console.log(`      ${f}`);
    console.log(`\n  Create these files (or pull them from the template) and retry.\n`);
    return 1;
  }

  if (missing.length > 0) {
    const components = missing.filter((d) => !isComposableName(d));
    const composables = missing.filter((d) => isComposableName(d));
    console.log(
      `\n  Installing ${name} + ${missing.length} missing dep${missing.length > 1 ? 's' : ''}:\n`,
    );
    if (components.length) console.log(`  Components : ${components.join(', ')}`);
    if (composables.length) console.log(`  Composables: ${composables.join(', ')}`);
    console.log('');
    for (const dep of missing) await installItem(dep, lock);
    console.log('');
  }

  const success = await installItem(name, lock);
  writeLockfile(lock);
  const missingPackages = collectMissingPackages(allToInstall, requiresMap, readPackageJson());
  if (missingPackages.length > 0) {
    console.log(`
  ! ${name} needs packages this project does not list:
`);
    console.log(`      pnpm add ${missingPackages.join(' ')}
`);
  }
  if (ok) await checkStyles(index, lock);
  console.log('');
  return success ? 0 : 1;
};

// ─── entry ───────────────────────────────────────────────────────────────────

async function run() {
  if (!command || command === '--help' || command === '-h') {
    showHelp();
    return;
  }
  let code = 0;
  if (command === 'list') {
    await listCommand();
  } else if (command === 'styles') {
    code = await stylesCommand();
  } else if (command === 'verify') {
    code = await verifyCommand();
  } else {
    code = await addCommand(command);
  }
  if (code !== 0) process.exit(code);
}

// Only when run as a script (`pnpm add-component …`), so tests can import the helpers above.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch((err) => {
    console.error(`\n  ✗ Fatal error: ${err.message}`);
    process.exit(1);
  });
}
