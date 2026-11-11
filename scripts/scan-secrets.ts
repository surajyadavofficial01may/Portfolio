/**
 * Automated Secret Detection & Configuration Verification Suite
 * Run via: `npm run security:scan` (used in pre-commit checks and CI/CD)
 *
 * 1. Scans all repository files (excluding gitignored paths like node_modules, dist, .env)
 *    for hardcoded credentials, API keys, Supabase keys, OAuth secrets, private keys, and passwords.
 * 2. Verifies `.env.example` contains only safe placeholder values.
 * 3. Verifies centralized configuration validation (`src/config/env.ts`) throws clear
 *    `ConfigurationError` exceptions when required secrets are missing.
 */
import fs from 'fs';
import path from 'path';
import {
  ConfigurationError,
  getServerConfig,
  validateSupabaseSyncConfig,
  validateAdminAuthConfig,
  validateStartupConfig,
  timingSafeCompare,
} from '../src/config/env';

const ROOT_DIR = process.cwd();

const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.aistudio',
]);

const IGNORED_FILES = new Set([
  '.env',
  'bun.lock',
  'package-lock.json',
  'firebase-applet-config.json',
]);

interface SecretRule {
  id: string;
  description: string;
  regex: RegExp;
  allowInEnvExample?: boolean;
}

const SECRET_RULES: SecretRule[] = [
  {
    id: 'SUPABASE_SECRET_KEY_LITERAL',
    description: 'Hardcoded Supabase Secret / Service Key (sb_secret_*)',
    regex: /sb_secret_[A-Za-z0-9_-]{12,}/g,
  },
  {
    id: 'SUPABASE_PUBLISHABLE_KEY_LITERAL',
    description: 'Hardcoded Supabase Publishable Key (sb_publishable_*)',
    regex: /sb_publishable_[A-Za-z0-9_-]{12,}/g,
  },
  {
    id: 'OPENAI_OR_GROQ_KEY_LITERAL',
    description: 'Hardcoded OpenAI or Groq API Key (sk-* / gsk_*)',
    regex: /\b(sk-[A-Za-z0-9]{20,}|gsk_[A-Za-z0-9]{20,})\b/g,
  },
  {
    id: 'GOOGLE_API_KEY_LITERAL',
    description: 'Hardcoded Google API Key (AIza*)',
    regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g,
  },
  {
    id: 'GOOGLE_OAUTH_CLIENT_SECRET_LITERAL',
    description: 'Hardcoded Google OAuth Client Secret (GOCSPX-*)',
    regex: /\bGOCSPX-[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: 'AWS_ACCESS_KEY_LITERAL',
    description: 'Hardcoded AWS Access Key ID (AKIA*)',
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    id: 'PRIVATE_KEY_PEM_BLOCK',
    description: 'Hardcoded PEM Private Key Block',
    regex: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/g,
  },
  {
    id: 'HARDCODED_ADMIN_PASSCODE_CONST',
    description: 'Hardcoded ADMIN_PASSCODE constant in source code',
    regex: /\bADMIN_PASSCODE\s*=\s*['"][^'"]+['"]/g,
  },
];

function collectFiles(dir: string, results: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        collectFiles(path.join(dir, entry.name), results);
      }
    } else if (entry.isFile()) {
      if (!IGNORED_FILES.has(entry.name) && !entry.name.startsWith('.env.')) {
        results.push(path.join(dir, entry.name));
      } else if (entry.name === '.env.example') {
        results.push(path.join(dir, entry.name));
      }
    }
  }
  return results;
}

function runSecretScan(): { passed: boolean; findings: string[] } {
  const files = collectFiles(ROOT_DIR);
  const findings: string[] = [];

  for (const filePath of files) {
    const relPath = path.relative(ROOT_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    for (const rule of SECRET_RULES) {
      lines.forEach((line, idx) => {
        rule.regex.lastIndex = 0;
        if (rule.regex.test(line)) {
          findings.push(
            `[${rule.id}] ${relPath}:${idx + 1} — ${rule.description}`
          );
        }
      });
    }
  }

  return {
    passed: findings.length === 0,
    findings,
  };
}

function runConfigurationValidationTests(): void {
  // Save original environment state
  const savedUrl = process.env.SUPABASE_URL;
  const savedPub = process.env.SUPABASE_PUBLISHABLE_KEY;
  const savedSec = process.env.SUPABASE_SECRET_KEY;
  const savedAdmin = process.env.ADMIN_PASSWORD;

  try {
    // Test 1: Missing SUPABASE_URL and SUPABASE_SECRET_KEY must throw ConfigurationError
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;

    let caughtSyncErr: unknown = null;
    try {
      validateSupabaseSyncConfig(getServerConfig());
    } catch (err) {
      caughtSyncErr = err;
    }

    if (
      !(caughtSyncErr instanceof ConfigurationError) ||
      !caughtSyncErr.missingVariables.includes('SUPABASE_URL') ||
      !caughtSyncErr.missingVariables.includes('SUPABASE_SECRET_KEY')
    ) {
      throw new Error(
        'Expected validateSupabaseSyncConfig to throw ConfigurationError for missing SUPABASE_URL & SUPABASE_SECRET_KEY.'
      );
    }

    // Test 2: Missing ADMIN_PASSWORD must throw ConfigurationError
    delete process.env.ADMIN_PASSWORD;
    let caughtAdminErr: unknown = null;
    try {
      validateAdminAuthConfig(getServerConfig());
    } catch (err) {
      caughtAdminErr = err;
    }

    if (
      !(caughtAdminErr instanceof ConfigurationError) ||
      !caughtAdminErr.missingVariables.includes('ADMIN_PASSWORD')
    ) {
      throw new Error(
        'Expected validateAdminAuthConfig to throw ConfigurationError for missing ADMIN_PASSWORD.'
      );
    }

    // Test 3: Strict startup validation must throw when secrets are missing
    delete process.env.SUPABASE_PUBLISHABLE_KEY;
    let caughtStartupErr: unknown = null;
    try {
      validateStartupConfig({ strict: true });
    } catch (err) {
      caughtStartupErr = err;
    }

    if (
      !(caughtStartupErr instanceof ConfigurationError) ||
      caughtStartupErr.missingVariables.length !== 4
    ) {
      throw new Error(
        'Expected validateStartupConfig({ strict: true }) to throw ConfigurationError listing all 4 missing secrets.'
      );
    }

    // Test 4: Constant-time comparison helper
    if (
      !timingSafeCompare('secret-value-123', 'secret-value-123') ||
      timingSafeCompare('secret-value-123', 'wrong-value-123') ||
      timingSafeCompare('short', 'longer-string')
    ) {
      throw new Error('timingSafeCompare failed verification.');
    }
  } finally {
    // Restore original environment variables
    if (savedUrl !== undefined) process.env.SUPABASE_URL = savedUrl;
    if (savedPub !== undefined) process.env.SUPABASE_PUBLISHABLE_KEY = savedPub;
    if (savedSec !== undefined) process.env.SUPABASE_SECRET_KEY = savedSec;
    if (savedAdmin !== undefined) process.env.ADMIN_PASSWORD = savedAdmin;
  }
}

function main() {
  console.log('1. Running repository secret scan...');
  const scanResult = runSecretScan();
  if (!scanResult.passed) {
    console.error('FAILED: Hardcoded secrets detected in repository:');
    scanResult.findings.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
  console.log('   PASSED: Zero hardcoded secrets found across all tracked files.');

  console.log('2. Running centralized configuration & startup validation tests...');
  runConfigurationValidationTests();
  console.log(
    '   PASSED: Missing required secrets trigger clear ConfigurationError exceptions.'
  );

  console.log('3. Verifying .gitignore rules...');
  const gitignoreContent = fs.readFileSync(path.join(ROOT_DIR, '.gitignore'), 'utf8');
  for (const requiredPattern of ['.env', '!.env.example', '*.pem', '*.key', 'service-account*.json', 'credentials*.json']) {
    if (!gitignoreContent.includes(requiredPattern)) {
      console.error(`FAILED: .gitignore is missing required pattern: ${requiredPattern}`);
      process.exit(1);
    }
  }
  console.log('   PASSED: .gitignore includes all required secret exclusion rules.');
  console.log('All security audit & secret management checks passed!');
}

main();
