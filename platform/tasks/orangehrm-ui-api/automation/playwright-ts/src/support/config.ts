import * as path from 'path';

/**
 * Central configuration. Every value comes from an environment variable; only
 * non-secret values have defaults. Credentials have no default and are read
 * lazily, so listing and type-checking work without them.
 */

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value.trim() === '' ? fallback : value.trim();
}

/** Thrown when a required variable is missing; distinguishable from an assertion failure. */
export class MissingConfigurationError extends Error {
  constructor(name: string) {
    super(`[CONFIGURATION] Missing required environment variable: ${name}. Set it in the shell or the IDE run configuration; it is never stored in the project.`);
    this.name = 'MissingConfigurationError';
  }
}

export function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') throw new MissingConfigurationError(name);
  return value;
}

// One run id per command: computed once in the runner process and inherited by workers.
if (!process.env.QA_RUN_ID) {
  process.env.QA_RUN_ID = 'local-' + new Date().toISOString().replace(/[-:]/g, '').replace(/\..*$/, '') + 'Z';
}

const timeoutMs = Number(optional('QA_TIMEOUT_MS', '30000'));
const artifactsDir = path.resolve(__dirname, '..', '..', optional('QA_ARTIFACTS_DIR', '../../automation-execution/results'));
const runId = process.env.QA_RUN_ID;

export const settings = {
  baseUrl: optional('QA_BASE_URL', 'https://opensource-demo.orangehrmlive.com'),
  browser: optional('QA_BROWSER', 'chromium') as 'chromium' | 'firefox' | 'webkit',
  headless: optional('QA_HEADLESS', 'true').toLowerCase() !== 'false',
  timeoutMs,
  /** Whole-test budget: one login plus six steps, each bounded by timeoutMs. */
  testTimeoutMs: timeoutMs * 8,
  runId,
  /** Evidence root for this framework and run: <artifacts>/<run-id>/playwright-ts */
  runDir: path.join(artifactsDir, runId, 'playwright-ts'),
};

/** DATA-001: demo account, read only from the environment (names, never values, are logged). */
export function credentials(): { username: string; password: string } {
  return { username: required('QA_USERNAME'), password: required('QA_PASSWORD') };
}
