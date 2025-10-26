#!/usr/bin/env node

/**
 * CLI for exporting a deposit (metadata + files) from Orvium.
 *
 * Usage:
 *   $ orvium-tools-export <depositId> <downloadDirectory>
 *   # via npx:
 *   $ npx orvium-tools-export <depositId> <downloadDirectory>
 *
 * Arguments:
 *   <depositId>          The Orvium deposit ID to export
 *   <downloadDirectory>  Local directory where files will be written
 *
 * Behavior:
 *   - Validates required CLI arguments.
 *   - Calls `exportDeposit(depositId, downloadDirectory)`.
 *   - Prints the result or any errors.
 *
 * Notes:
 *   - If your core function relies on environment variables (e.g. ORVIUM_TOKEN),
 *     you can enable `.env` support by uncommenting the dotenv block below.
 */

import { exportDeposit } from "./export-deposit";

// Optional: load .env (uncomment if needed)
// import 'dotenv/config';

// --- Parse & validate args ---------------------------------------------------

const [depositId, downloadDirectory] = process.argv.slice(2);

const USAGE = "Usage: orvium-tools-export <depositId> <downloadDirectory>";

if (!depositId || !downloadDirectory) {
  console.error(USAGE);
  process.exit(2); // 2 = incorrect usage
}

// --- Execute -----------------------------------------------------------------

exportDeposit(depositId, downloadDirectory).catch((err) => {
  console.error("Error during deposit export:", err?.message ?? err);
  process.exit(1); // 1 = runtime error
});
