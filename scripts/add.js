import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';

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
  ref = args[refIdx].includes('=')
    ? args[refIdx].split('=')[1]
    : args[refIdx + 1];
}
const positional = args.filter(
  (a, i) => !a.startsWith('--') && args[i - 1] !== '--ref'
);
const command = positional[0];

const REGISTRY_BASE = `https://raw.githubusercontent.com/${REGISTRY_REPO}/${ref}`;
const REGISTRY_INDEX = `${REGISTRY_BASE}/registry.json`;

// ─── paths ───────────────────────────────────────────────────────────────────

const isComposableName = (name) => /^use[A-Z]/.test(name);

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

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

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

  // Overwrite protection: if the file on disk doesn't match the last-installed
  // SHA, the user has edited it. Require --force or an interactive y/N.
  if (!force && fs.existsSync(dest) && record) {
    const current = fs.readFileSync(dest, 'utf8');
    const currentSha = sha256(current);
    if (currentSha !== record.sha) {
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
  try { res = await fetchWithRetry(REGISTRY_INDEX); } catch (err) {
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
  if (!items?.length) { console.log(`No ${label} in registry yet.`); return; }
  console.log(`\nAvailable ${label} (ref: ${ref}):\n`);
  items.forEach((name) => console.log(`  ${isInstalled(name) ? '✓' : '·'} ${name}`));
  console.log('');
};

const verifyCommand = async () => {
  const lock = readLockfile();
  const entries = Object.entries(lock.installed ?? {});
  if (!entries.length) { console.log('No installed items recorded in vuetail.json.'); return; }
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
  process.exit(drift === 0 ? 0 : 1);
};

const addCommand = async (name) => {
  if (ref === 'main') {
    console.log(`  ! Using ref 'main' — output is not reproducible. Pin with --ref <tag|sha>.\n`);
  }

  let res;
  try { res = await fetchWithRetry(REGISTRY_INDEX); } catch (err) {
    console.log(`  ! Registry unreachable: ${err.message}`);
    process.exit(1);
  }
  const index = res.ok ? await res.json() : {};
  const depMap = index.dependencies ?? {};
  const requiresMap = index.requires ?? {};
  if (!res.ok) {
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
    process.exit(1);
  }

  if (missing.length > 0) {
    const components = missing.filter((d) => !isComposableName(d));
    const composables = missing.filter((d) => isComposableName(d));
    console.log(`\n  Installing ${name} + ${missing.length} missing dep${missing.length > 1 ? 's' : ''}:\n`);
    if (components.length) console.log(`  Components : ${components.join(', ')}`);
    if (composables.length) console.log(`  Composables: ${composables.join(', ')}`);
    console.log('');
    for (const dep of missing) await installItem(dep, lock);
    console.log('');
  }

  await installItem(name, lock);
  writeLockfile(lock);
  console.log('');
};

// ─── entry ───────────────────────────────────────────────────────────────────

if (!command || command === '--help' || command === '-h') { showHelp(); process.exit(0); }
if (command === 'list') { await listCommand(); process.exit(0); }
if (command === 'verify') { await verifyCommand(); process.exit(0); }
await addCommand(command);
