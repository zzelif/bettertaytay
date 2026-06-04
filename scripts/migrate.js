import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.resolve(__dirname, '../db/migrations');
const DB_BINDING = 'BETTERTAYTAY_DB';

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';

// Color output formatting helpers
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function logInfo(msg) {
  console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`);
}
function logSuccess(msg) {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`);
}
function logWarning(msg) {
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`);
}
function logError(msg) {
  console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`);
}

// Check if wrangler is available
function checkWrangler() {
  try {
    execSync('npx wrangler --version', { stdio: 'ignore' });
  } catch (err) {
    logError(
      'Wrangler is not installed or available via npx. Please run npm install.'
    );
    process.exit(1);
  }
}

// Get list of migration files on disk sorted alphabetically
function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    logWarning(`Migrations directory not found at ${MIGRATIONS_DIR}`);
    return [];
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
}

// Check if schema_migrations table exists
function checkSchemaTable(flag) {
  try {
    const rawResult = execSync(
      `npx wrangler d1 execute ${DB_BINDING} ${flag} --command="SELECT name FROM sqlite_master WHERE type='table' AND name='schema_migrations';" --json`,
      {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    );
    const parsed = JSON.parse(rawResult);
    if (
      Array.isArray(parsed) &&
      parsed[0] &&
      parsed[0].results &&
      parsed[0].results.length > 0
    ) {
      return true;
    }
  } catch (err) {
    // If command fails, table doesn't exist
  }
  return false;
}

// Create schema_migrations table
function createSchemaTable(flag) {
  logInfo('Creating schema_migrations table...');
  const sql = `CREATE TABLE IF NOT EXISTS schema_migrations (
    migration TEXT PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`;
  try {
    execSync(
      `npx wrangler d1 execute ${DB_BINDING} ${flag} --command="${sql}"`,
      { stdio: 'ignore' }
    );
    logSuccess('Schema migrations table created');
  } catch (err) {
    logError(`Failed to create schema migrations table: ${err.message}`);
    process.exit(1);
  }
}

// Get applied migrations from database
function getAppliedMigrations(flag) {
  if (!checkSchemaTable(flag)) {
    return [];
  }
  try {
    const rawResult = execSync(
      `npx wrangler d1 execute ${DB_BINDING} ${flag} --command="SELECT migration FROM schema_migrations ORDER BY migration;" --json`,
      {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    );
    const parsed = JSON.parse(rawResult);
    if (Array.isArray(parsed) && parsed[0] && parsed[0].results) {
      return parsed[0].results.map(r => r.migration);
    }
  } catch (err) {
    logWarning(`Failed to query applied migrations: ${err.message}`);
  }
  return [];
}

// Apply a single migration file
function runMigration(migrationFile, flag) {
  const migrationName = path.basename(migrationFile);
  logInfo(`Applying migration: ${migrationName}`);

  try {
    // Run the migration file
    execSync(
      `npx wrangler d1 execute ${DB_BINDING} ${flag} --file="${migrationFile}"`,
      { stdio: 'inherit' }
    );

    // Record the migration in schema_migrations
    const sql = `INSERT INTO schema_migrations (migration) VALUES ('${migrationName}');`;
    execSync(
      `npx wrangler d1 execute ${DB_BINDING} ${flag} --command="${sql}"`,
      { stdio: 'ignore' }
    );

    logSuccess(`Migration applied: ${migrationName}`);
  } catch (err) {
    logError(`Failed to apply migration ${migrationName}: ${err.message}`);
    process.exit(1);
  }
}

// Run pending migrations
function runMigrations(flag, envName) {
  // Safety gate: remote migrations require explicit confirmation BEFORE any DB calls
  if (flag === '--remote') {
    const isForce =
      process.argv.includes('--force') ||
      process.argv.includes('--yes') ||
      process.env.CI === 'true';
    if (!isForce) {
      logError('Remote migrations require explicit confirmation.');
      console.log('');
      console.log(
        '  Run with --force to proceed: node scripts/migrate.js remote --force'
      );
      console.log(
        '  This will modify the PRODUCTION database. Ensure backups are current.'
      );
      console.log('');
      process.exit(1);
    }
    logInfo('Confirmation flag provided. Proceeding with remote migrations.');
  }

  logInfo(`Starting migrations for ${envName}...`);
  checkWrangler();

  if (!checkSchemaTable(flag)) {
    createSchemaTable(flag);
  }

  const applied = getAppliedMigrations(flag);
  const files = getMigrationFiles();

  const pending = files.filter(file => !applied.includes(file));

  if (pending.length === 0) {
    logSuccess('No pending migrations to apply');
    return;
  }

  logInfo(`Found ${pending.length} pending migration(s)`);

  if (flag === '--remote') {
    logWarning(
      '⚠️  You are about to run migrations on the PRODUCTION database!'
    );
    console.log(pending.map(f => `  - ${f}`).join('\n'));
    console.log();
  }

  for (const file of pending) {
    runMigration(path.join(MIGRATIONS_DIR, file), flag);
  }

  logSuccess('All migrations applied successfully');
}

// Show migration status
function showStatus() {
  checkWrangler();

  console.log('\n=== Local Database ===');
  if (checkSchemaTable('--local')) {
    const applied = getAppliedMigrations('--local');
    console.log('Applied migrations:');
    if (applied.length > 0) {
      applied.forEach(m => console.log(`  ✓ ${m}`));
    } else {
      console.log('  (none)');
    }
  } else {
    console.log('Schema migrations table not found (no migrations run yet).');
  }

  console.log('\n=== Remote Database (Production) ===');
  if (checkSchemaTable('--remote')) {
    const applied = getAppliedMigrations('--remote');
    console.log('Applied migrations:');
    if (applied.length > 0) {
      applied.forEach(m => console.log(`  ✓ ${m}`));
    } else {
      console.log('  (none)');
    }
  } else {
    console.log('Schema migrations table not found (no migrations run yet).');
  }

  console.log('\n=== Available Migration Files ===');
  const files = getMigrationFiles();
  if (files.length > 0) {
    files.forEach(f => console.log(`  - ${f}`));
  } else {
    console.log('  (none)');
  }
  console.log();
}

// Create new migration file
function createMigration(name) {
  if (!name) {
    logError('Migration name is required.');
    console.log('Usage: node scripts/migrate.js create <migration_name>');
    process.exit(1);
  }

  const now = new Date();
  const timestamp =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

  const filename = `${timestamp}_${name}.sql`;
  const filepath = path.join(MIGRATIONS_DIR, filename);

  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
  }

  const template = `-- Migration: ${filename}
-- Created: ${now.toISOString().replace('T', ' ').substring(0, 19)}
-- Description: ${name}

-- Add your migration SQL here
`;

  fs.writeFileSync(filepath, template, 'utf-8');
  logSuccess(`Migration file created: ${filepath}`);
}

// Verify migration safety
function verifyMigrations() {
  logInfo('Verifying migration files...');
  const files = getMigrationFiles();
  let hasErrors = false;

  for (const file of files) {
    const filepath = path.join(MIGRATIONS_DIR, file);
    const content = fs.readFileSync(filepath, 'utf-8');

    if (content.toUpperCase().includes('DROP TABLE')) {
      logWarning(`${file} contains DROP TABLE - ensure this is intentional`);
      hasErrors = true;
    }

    if (
      content.toUpperCase().includes('UPDATE') &&
      content.toUpperCase().includes('SET') &&
      !content.toUpperCase().includes('WHERE')
    ) {
      logError(`${file} contains UPDATE without WHERE clause`);
      hasErrors = true;
    }

    if (
      content.toUpperCase().includes('DELETE FROM') &&
      !content.toUpperCase().includes('WHERE')
    ) {
      logError(`${file} contains DELETE without WHERE clause`);
      hasErrors = true;
    }

    if (
      content.toUpperCase().includes('CREATE TABLE') &&
      !content.toUpperCase().includes('IF NOT EXISTS')
    ) {
      logWarning(`${file} uses CREATE TABLE without IF NOT EXISTS`);
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    logSuccess('All migration files verified successfully');
  } else {
    logError('Migration verification completed with issues');
    process.exit(1);
  }
}

// Parse commands
const commandMap = {
  local: () => runMigrations('--local', 'local'),
  remote: () => runMigrations('--remote', 'production'),
  status: () => showStatus(),
  create: () => createMigration(args[1]),
  verify: () => verifyMigrations(),
};

if (commandMap[command]) {
  commandMap[command]();
} else {
  console.log('D1 Database Migration Automation (Node.js)');
  console.log('\nUsage: node scripts/migrate.js <command> [args]');
  console.log('\nCommands:');
  console.log('  local              Run migrations on local database');
  console.log(
    '  remote             Run migrations on remote (production) database'
  );
  console.log(
    '  status             Show migration status for local and remote'
  );
  console.log('  create <name>      Create a new migration file');
  console.log('  verify             Verify migration file safety');
  console.log();
  process.exit(1);
}
