#!/usr/bin/env node

import { exportDeposit } from './export-deposit';  // Import the core function from the programmatic entry point

const depositId: string = process.argv[2];  

// Check is provided, otherwise exit
if (!depositId) {
    console.error('Please use: npx ts-node import.ts  <depositId> <donwloadDirectory>');
    process.exit(1);
}

// Obtain filepath to JSON metadata folder in the command line
const downloadPath: string = process.argv[3];  

// Check is provided, otherwise exit
if (!downloadPath) {
    console.error('Please use: npx ts-node import.ts <depositId> <donwloadDirectory>');
    process.exit(1);
}


// Validate arguments
if (!depositId || !downloadPath) {
  console.error('Usage: deposit-importer <directory> <community>');
  process.exit(1);
}

// Execute the export process using the provided arguments
exportDeposit(depositId,downloadPath)
  .catch(err => console.error('Error during deposit export:', err));
