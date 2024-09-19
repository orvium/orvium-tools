# Orvium Deposit Import Tool

This Node.js tool is designed to automate the process of importing deposits (such as manuscripts) into the Orvium platform. It handles loading metadata, creating deposits, uploading manuscripts, and confirming the upload through API requests.

## Features

- Import deposit metadata from JSON files.
- Upload manuscript files to a pre-signed URL.
- Confirm manuscript uploads.
- Supports authentication via API key.

## Requirements

- Node.js (v14+)
- TypeScript
- Environment variables for API configuration.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/orvium-deposit-import.git
cd orvium-tools
```

2. Install the dependencies:
    
```bash
npm install
```

3. Define enviroment variables required:

```bash
API_KEY=your-api-key
API_KEY_USER=your-api-key-user
API_URL=https://api.orvium.io
```

## Usage
```bash
npx ts-node import.ts <directory-path> <community>
```
where:
- <directory-path>: The path to the directory containing the meta.json and manuscript file (e.g., Manuscript.docx).
- <community>: The name or identifier of the community in which the deposit is categorized.

### Example
```bash
npx ts-node import.ts ./preprint111 'Test Community'
```

