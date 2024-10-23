#!/usr/bin/env node

/**
 * CLI tool for importing deposits and uploading manuscripts to the Orvium platform.
 *
 * This script provides a command-line interface (CLI) for automating the import of deposit data 
 * and manuscript files to the Orvium platform. It expects two command-line arguments:
 *
 * - `<directory>`: The directory path where the JSON metadata and manuscript files are located.
 * - `<community>`: The community identifier to which the deposit will be associated.
 *
 * The script performs the following tasks:
 * 
 * - Loads environment variables using `dotenv` for API authentication and configuration.
 * - Validates the provided command-line arguments (directory path and community).
 * - Executes the `importDeposit` function from the core module, which handles the full import and upload process.
 * - Outputs the result or any errors encountered during the process.
 *
 * Example usage:
 * ```
 * npx importDeposit <directory> <community>
 * ```
 *
 * This script is designed for use in automation pipelines or as a standalone tool for uploading deposits 
 * on the Orvium platform.
 */

import { importDeposit } from './import';  // Import the core function from the programmatic entry point
import dotenv from 'dotenv';
dotenv.config();

// Obtain filepath to JSON metadata folder in the command line
const directoryPath: string = process.argv[2];  

// Check is provided, otherwise exit
if (!directoryPath) {
    console.error('Please use: npx ts-node import.ts <directory> <community>');
    process.exit(1);
}

const community: string = process.argv[3];  

// Check is provided, otherwise exit
if (!community) {
    console.error('Please use: npx ts-node import.ts <directory> <community>');
    process.exit(1);
}

// Validate arguments
if (!directoryPath || !community) {
  console.error('Usage: deposit-importer <directory> <community>');
  process.exit(1);
}

// Execute the import process using the provided arguments
importDeposit(directoryPath, community)
  .catch(err => console.error('Error during deposit import:', err));