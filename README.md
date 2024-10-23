# Orvium Tools

**Orvium Tools** is a command-line and programmatic tool for managing deposits and manuscripts on the Orvium platform. This tool simplifies the process of importing deposits and manuscripts into Orvium communities, and it can be used both via CLI and within other Node.js applications.

## Features

- **Import Deposits**: Automatically import a deposit with associated metadata and manuscript files into an Orvium community.
- **Programmatic Usage**: Use the tool within your Node.js project to integrate the import functionality into your own workflows.

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

```bash
npx @orvium/orvium-tools <manuscriptPath> <community>
```
- <directory>: The path to the folder that contains the deposit metadata and manuscript files (required).
- <community>: The name of the Orvium community where the deposit should be uploaded (required).

#### Example

```bash
orvium-tools ./manuscripts/manuscript_1 Orvium
```bash

### Option 2: Install Globally

To install Orvium Tools globally on your machine:

```bash
npm install -g @orvium/orvium-tools
```

### Option 3: Install Locally for Programmatic Usage

To use Orvium Tools programmatically in your Node.js project, install it as a dependency:

```bash
npm install @orvium/orvium-tools --save
```

## Usage

### CLI
Orvium Tools provides a simple CLI for managing deposits in Orvium. Currently, the main feature is importing deposits.

```bash
orvium-tools <manuscriptPath> <community>
```

Please make sure your PATH include the global NPM bin directory.


### Programmatic Usage
You can also use Orvium Tools within your own Node.js applications. The main function available for programmatic use is importDeposit, which imports a deposit into an Orvium community.

#### Example:

```typescript
import { importDeposit } from '@orvium/orvium-tools';

const directoryPath = './Downloads/54441';
const community = 'Test Community';

importDeposit(directoryPath, community)
  .then(() => console.log('Deposit imported successfully'))
  .catch(err => console.error('Error during deposit import:', err));
```

This will allow you to integrate the deposit import process into your existing application or workflow.

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
git clone https://github.com/orvium/orvium-tools.git
cd orvium-tools
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Build the project:

```bash
npm run build
```

### 4. Test locally:
You can test the tool locally using npm link to create a symlink to your local package:

```bash
npm link
orvium-tools ./manuscripts/manuscript_1 Orvium
```

### 5. Run in development mode:
To run the TypeScript files directly (without building):

```bash
npx ts-node src/import_cli.ts ./manuscripts/manuscript_1 Orvium
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.
