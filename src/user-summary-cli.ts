#!/usr/bin/env node

/**
 * CLI for fetching a user's contributions summary by ORCID (number only).
 *
 * Usage:
 *   $ orvium-tools-user-summary <orcid>
 *
 * Example:
 *   $ orvium-tools-user-summary 0000-0002-1825-0097
 */

import { getUserSummary } from "./user-summary";

// --- Parse & validate args ---------------------------------------------------
const [orcidNumber] = process.argv.slice(2);
const USAGE = "Usage: orvium-tools-user-summary <orcid>";

if (!orcidNumber) {
  console.error(USAGE);
  process.exit(2);
}

// Accept ONLY the numeric ORCID pattern (no URLs)
const ORCID_REGEX = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9Xx]$/;
if (!ORCID_REGEX.test(orcidNumber)) {
  console.error("Invalid ORCID. Expected format: 0000-0000-0000-0000");
  process.exit(2);
}

// Uppercase the check digit if it's X/x
const normalizedOrcid = orcidNumber.toUpperCase();

// --- Execute -----------------------------------------------------------------

getUserSummary(normalizedOrcid)
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error during user summary retrieval:", err?.message ?? err);
    process.exit(1);
  });
