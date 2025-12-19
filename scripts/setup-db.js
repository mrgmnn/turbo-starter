#!/usr/bin/env node

/**
 * Database Setup Script
 *
 * This script automates the database setup process:
 * 1. Prompts for project name
 * 2. Updates package.json with the project name
 * 3. Creates the database in PostgreSQL
 * 4. Generates DATABASE_URL connection string
 * 5. Creates/updates .env files in apps/api and packages/prisma
 * 6. Runs npm install
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Create readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask user a question and return the answer
 */
function question(rl, query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Convert project name to package.json compatible name
 * - Lowercase
 * - Replace spaces and special chars with hyphens
 * - Remove consecutive hyphens
 * - Trim hyphens from start/end
 */
function sanitizePackageName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert project name to database name
 * - Lowercase
 * - Replace spaces and special chars with underscores
 * - Remove consecutive underscores
 * - Trim underscores from start/end
 */
function sanitizeDatabaseName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Log styled messages to console
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Check if Docker is running
 */
function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if PostgreSQL container is running
 */
function isPostgresRunning() {
  try {
    const result = execSync('docker ps --filter "name=postgres" --format "{{.Names}}"', {
      encoding: 'utf-8',
    });
    return result.trim().length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Start PostgreSQL container using docker-compose
 */
function startPostgres() {
  log('\n📦 Starting PostgreSQL container...', colors.blue);
  try {
    execSync('docker compose up -d', {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });
    log('✅ PostgreSQL container started successfully', colors.green);
    // Wait a moment for PostgreSQL to be ready
    log('⏳ Waiting for PostgreSQL to be ready...', colors.yellow);
    execSync('sleep 3');
  } catch (error) {
    log('❌ Failed to start PostgreSQL container', colors.red);
    throw error;
  }
}

/**
 * Create database in PostgreSQL
 */
function createDatabase(dbName) {
  log(`\n🗄️  Creating database "${dbName}"...`, colors.blue);

  try {
    // Try to create the database
    execSync(`docker exec -i postgres psql -U postgres -c "CREATE DATABASE ${dbName};"`, { encoding: 'utf-8' });
    log(`✅ Database "${dbName}" created successfully`, colors.green);
    return true;
  } catch (error) {
    // Check if database already exists
    if (error.message.includes('already exists')) {
      log(`⚠️  Database "${dbName}" already exists, continuing...`, colors.yellow);
      return true;
    }
    log(`❌ Failed to create database: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Generate DATABASE_URL connection string
 */
function generateDatabaseUrl(dbName) {
  return `postgresql://postgres:postgres@localhost:5432/${dbName}?schema=public`;
}

/**
 * Create or update .env file
 */
function updateEnvFile(filePath, dbUrl, additionalVars = {}) {
  const dirname = path.dirname(filePath);

  // Ensure directory exists
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  let envContent = '';

  // Read existing .env file if it exists
  if (fs.existsSync(filePath)) {
    envContent = fs.readFileSync(filePath, 'utf-8');
  }

  // Update or add DATABASE_URL
  const urlRegex = /^DATABASE_URL=.*$/m;
  if (urlRegex.test(envContent)) {
    envContent = envContent.replace(urlRegex, `DATABASE_URL="${dbUrl}"`);
  } else {
    envContent += `\nDATABASE_URL="${dbUrl}"\n`;
  }

  // Add additional variables
  for (const [key, value] of Object.entries(additionalVars)) {
    const varRegex = new RegExp(`^${key}=.*$`, 'm');
    if (varRegex.test(envContent)) {
      envContent = envContent.replace(varRegex, `${key}=${value}`);
    } else {
      envContent += `${key}=${value}\n`;
    }
  }

  // Write the file
  fs.writeFileSync(filePath, envContent.trim() + '\n');
  log(`✅ Updated ${path.relative(ROOT_DIR, filePath)}`, colors.green);
}

/**
 * Run npm install
 */
function runNpmInstall() {
  log('\n📦 Running npm install...', colors.blue);

  return new Promise((resolve, reject) => {
    const npm = spawn('npm', ['install'], {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });

    npm.on('close', code => {
      if (code === 0) {
        log('✅ npm install completed successfully', colors.green);
        resolve();
      } else {
        log(`❌ npm install failed with code ${code}`, colors.red);
        reject(new Error(`npm install failed with code ${code}`));
      }
    });

    npm.on('error', error => {
      log(`❌ Failed to run npm install: ${error.message}`, colors.red);
      reject(error);
    });
  });
}

/**
 * Main setup function
 */
async function main() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('🚀 Turbo Starter - Database Setup', colors.bright + colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  const rl = createReadlineInterface();

  try {
    // Step 1: Check Docker
    log('📋 Checking prerequisites...', colors.blue);
    if (!isDockerRunning()) {
      log('❌ Docker is not running. Please start Docker and try again.', colors.red);
      process.exit(1);
    }
    log('✅ Docker is running', colors.green);

    // Step 2: Check/Start PostgreSQL
    if (!isPostgresRunning()) {
      startPostgres();
    } else {
      log('✅ PostgreSQL container is already running', colors.green);
    }

    // Step 3: Ask for project name
    log('\n' + '-'.repeat(60), colors.cyan);
    const projectName = await question(
      rl,
      `${colors.bright}Enter project name${colors.reset} (default: turbo-starter): `,
    );
    const rawProjectName = projectName.trim() || 'turbo-starter';

    // Generate package and database names
    const packageName = sanitizePackageName(rawProjectName);
    const databaseName = sanitizeDatabaseName(rawProjectName);

    log(`\n📝 Project name: ${rawProjectName}`, colors.bright);
    log(`📦 Package name: ${packageName}`, colors.cyan);
    log(`🗄️  Database name: ${databaseName}`, colors.cyan);

    // Step 4: Update root package.json
    log('\n📝 Updating package.json...', colors.blue);
    const packageJsonPath = path.join(ROOT_DIR, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.name = packageName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    log('✅ Updated package.json', colors.green);

    // Step 5: Create database
    if (!createDatabase(databaseName)) {
      process.exit(1);
    }

    // Step 6: Generate DATABASE_URL
    const databaseUrl = generateDatabaseUrl(databaseName);
    log(`\n🔗 Connection string: ${databaseUrl}`, colors.cyan);

    // Step 7: Update .env files
    log('\n📝 Updating environment files...', colors.blue);

    // Update apps/api/.env
    updateEnvFile(path.join(ROOT_DIR, 'apps', 'api', '.env'), databaseUrl, {
      NODE_ENV: 'development',
      PORT: '3000',
    });

    // Update packages/prisma/.env
    updateEnvFile(path.join(ROOT_DIR, 'packages', 'prisma', '.env'), databaseUrl);

    // Step 8: Run npm install
    await runNpmInstall();

    // Success!
    log('\n' + '='.repeat(60), colors.green);
    log('✨ Database setup completed successfully!', colors.bright + colors.green);
    log('='.repeat(60), colors.green);

    log('\n📚 Next steps:', colors.bright);
    log('  1. Define your schema: packages/prisma/schema/schema.prisma', colors.cyan);
    log('  2. Create migrations: npx prisma migrate dev --name init', colors.cyan);
    log('  3. Start development: npm run dev', colors.cyan);
    log('  4. View your data: npx prisma studio', colors.cyan);
    log('');
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, colors.red);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main();
