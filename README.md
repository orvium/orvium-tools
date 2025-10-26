# Orvium Tools

**Orvium Tools** is a command-line and programmatic toolkit for interacting with the Orvium API. It simplifies common workflows such as:

- Importing deposits and manuscripts into Orvium communities.
- Exporting deposits from Orvium as a zip file (metadata + manuscript files).
- Retrieving user contribution summaries by ORCID.
- Using all of the above either via CLI or inside your own Node.js applications.

## Features

- **Import Deposits**: Import a deposit with metadata and manuscript files into a target Orvium community.
- **Export Deposits**: Export a deposit as a zip file containing `meta.json` and manuscript files.
- **User Contribution Summary**: Retrieve a summary of a user’s contributions (deposits, reviews, communities) using their ORCID.
- **Programmatic Usage**: Import, export, and retrieve summaries directly inside your Node.js workflows.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [CLI](#cli)
- [Programmatic Usage](#programmatic-usage)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [License](#license)

## Installation

You can install the **Orvium Tools** package globally or use it directly via `npx`. You can also install it locally in your project for programmatic usage.

### Option 1: Run via `npx` (No Installation Required)

You can run **Orvium Tools** directly without installing it globally using `npx`:

#### Importing

```bash
npx  @orvium/orvium-tools-import <manuscriptPath> <community>

```

- **directory**: The path to the folder that contains the deposit metadata and manuscript files (required).
- **community**: The name of the Orvium community where the deposit should be uploaded (required).

#### Example

```bash
npx  orvium-tools-import  ./manuscripts/manuscript_1  Orvium

```

#### Exporting

```bash
npx  @orvium/orvium-tools-export <depositId> <directory>
```

- **depositId**: Orvium deposit unique identifier (required).
- **directory**: The path to the folder to download the zip file (required).

#### Example

```bash
npx  orvium-tools-export  34274234697423cdsf  /tmp
```

#### User Contribution Summary

```bash
npx orvium-tools-user-summary <orcid>
```

- **orcid**: ORCID iD of the user (e.g., 0000-0002-1825-0097).

#### Example

```bash
npx orvium-tools-user-summary 0000-0002-1825-0097
```

### Option 2: Install Globally

To install Orvium Tools globally on your machine:

```bash
npm  install  -g  @orvium/orvium-tools
```

### Option 3: Install Locally for Programmatic Usage

To use Orvium Tools programmatically in your Node.js project, install it as a dependency:

```bash
npm  install  @orvium/orvium-tools  --save
```

## Usage

### CLI

Orvium Tools provides a simple CLI for managing deposits in Orvium.

```bash

# Import a deposit
orvium-tools-import ./manuscripts/my_deposit "Ethics Community"
# Export a deposit
orvium-tools-export 64a09f6ce3d5ff0813586345 ./downloads
# Get user contribution summary
orvium-tools-user-summary 0000-0002-1825-0097
```

Please make sure your PATH include the global NPM bin directory.

### Programmatic Usage

You can also use Orvium Tools within your own Node.js applications.

#### Importing:

```typescript
import { importDeposit } from "@orvium/orvium-tools";

const directoryPath = "/manuscript/manuscript_1";
const community = "Orvium";

importDeposit(directoryPath, community)
  .then(() => console.log("Deposit imported successfully"))
  .catch((err) => console.error("Error during deposit import:", err));
```

#### Exporting:

```typescript
import { exportDeposit } from "@orvium/orvium-tools";

const depositId = "63214723845236xc631q3";
const directoryPath = "/tmp";

exportDeposit(depositId, directoryPath)
  .then(() => console.log("Deposit exported successfully"))
  .catch((err) => console.error("Error during deposit export:", err));
```

#### User Summary

```typescript
import { getUserSummary } from "@orvium/orvium-tools";

const orcid = "0000-0002-1825-0097";
const summary = await getUserSummary(orcid);
console.log("User contribution summary:", summary);
```

#### Example output

```json
{
  "nickname": "jane-doe",
  "orcid": "https://orcid.org/0000-0002-1825-0097",
  "isOpensciVerified": true,
  "depositsSummaryPopulated": [
    {
      "title": "Open Access in Practice",
      "abstract": "This paper explores the implementation of open access...",
      "publicationType": "Research article",
      "accessRight": "open",
      "submissionDate": "2025-01-15",
      "status": "published",
      "reviewType": "open",
      "authors": [
        { "firstName": "Jane", "lastName": "Doe" },
        { "firstName": "John", "lastName": "Smith" }
      ],
      "keywords": ["Open Science", "Publishing"],
      "doi": "https://doi.org/10.1234/example",
      "url": "https://platform.orvium.io/deposits/64a09f6ce3d5ff0813586345/view"
    }
  ],
  "peerReviewsSummaryPopulated": [
    {
      "_id": "65b7a0a8ef2cde1d3f98a77f",
      "creator": "65b79fa3ef2cde1d3f98a12c",
      "status": "published",
      "kind": "peer review",
      "decision": "accepted",
      "showIdentityToAuthor": true,
      "showIdentityToEveryone": false
    }
  ],
  "communitiesSummaryPopulated": [
    {
      "name": "Ethics, Privacy, and Legal Issues",
      "description": "A community focused on ethical and legal aspects of science.",
      "country": "Spain",
      "type": "community",
      "subscription": "free",
      "membershipType": "open",
      "logoURL": "https://assets.example.com/community/logo.png"
    }
  ]
}
```

## Environment Variables

To connect to the Orvium platform, Orvium Tools requires some environment variables to be set. These variables are typically loaded from a .env file located in your project root.

### Example .env file:

```makefile

API_KEY=your-api-key-here
API_KEY_USER=your-api-key-user-here
API_URL=https://your-orvium-api-url-here
```

Make sure to replace the placeholders with actual values for your Orvium environment.

## Development

If you want to contribute to the development of Orvium Tools or add your own features, follow these steps to get started:

### 1. Clone the repository:

```bash
git  clone  https://github.com/orvium/orvium-tools.git
cd  orvium-tools

```

### 2. Install dependencies:

```bash
npm  install
```

### 3. Build the project:

```bash
npm  run  build
```

### 4. Test locally:

You can test the tool locally using npm link to create a symlink to your local package:

```bash
npm  link
orvium-tools-import  ./manuscripts/manuscript_1  Orvium
```

### 5. Run in development mode:

To run the TypeScript files directly (without building):

```bash
npx  ts-node  src/import-deposit-cli.ts  ./manuscripts/manuscript_1  Orvium
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
