#!/usr/bin/env node

/**
 * CLI for importing deposits (metadata + manuscripts) into the Orvium platform.
 *
 * Usage:
 *   $ import-deposit <directory> <community>
 *   # or, if published:
 *   $ npx import-deposit <directory> <community>
 *
 * Arguments:
 *   <directory>  Path to the folder containing JSON metadata and manuscript files
 *   <community>  Community identifier to associate the deposit with
 *
 * Behavior:
 *   - Loads environment variables via `dotenv` for API auth/config.
 *   - Validates required CLI arguments.
 *   - Calls `importDeposit(directory, community)` to perform the import/upload.
 *   - Prints the result or any errors.
 *
 * Notes:
 *   - Set ORVIUM_TOKEN / ORVIUM_API in your environment or .env if your core function uses them.
 */

import { importDeposit } from "./import-deposit";

// --- Parse & validate args ---------------------------------------------------

const [directoryPath, community] = process.argv.slice(2);

const USAGE = "Usage: orvium-tools-import <directory> <community>";

if (!directoryPath || !community) {
  console.error(USAGE);
  process.exit(2); // 2 = incorrect usage
}

// --- Execute -----------------------------------------------------------------

importDeposit(directoryPath, community).catch((err) => {
  console.error("Error during deposit import:", err?.message ?? err);
  process.exit(1); // 1 = runtime error
});
