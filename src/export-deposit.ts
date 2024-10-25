import axios from 'axios';
import * as fs from 'fs'; // To save the ZIP file locally
import * as path from 'path';
import dotenv from 'dotenv';
import { Deposit, DepositPopulated } from './deposit-interfaces'
import archiver from 'archiver';

/**
 * Load and prepare environment variables
 */

dotenv.config();

//Obtain the api key from the env variable
const API_KEY: string | undefined = process.env.API_KEY;  
const API_KEY_USER: string | undefined = process.env.API_KEY_USER;

  
// Function to retrieve a deposit by ID
async function getDepositById(depositId: string): Promise<DepositPopulated | null> {
    const apiUrl = `${process.env.API_URL}/deposits/${depositId}`;
    try {
      // Make the GET request to retrieve deposit details
      const response = await axios.get<DepositPopulated>(apiUrl, {
        headers: {
          'x-api-key': API_KEY,
          'x-api-key-user': API_KEY_USER,
        },
      });
      // Return the deposit details from the response
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error(`Error: ${error.response.status} - ${error.response.data}`);
      } else {
        console.error('Error:', error.message);
      }
      return null;
    }
  }

// Function to get a signed URL for a specific file in the deposit and download the file
async function downloadDepositFile(
    depositId: string,
    filename: string,
    downloadPath: string
  ): Promise<void> {
    const fileUrl = `${process.env.API_URL}/deposits/${depositId}/files/${filename}`;
  
    try {
      // Request the signed URL for the file
      const response = await axios.get(fileUrl, {
        headers: {
          'x-api-key': API_KEY,
          'x-api-key-user': API_KEY_USER,
        },
        maxRedirects: 0, // Prevent axios from following the redirect
        validateStatus: (status) => status === 302, // Only accept status 302 for redirection
      });
  
      // Get the signed URL from the location header
      const signedUrl = response.headers['location'];
      if (!signedUrl) {
        throw new Error('Signed URL not found in response headers');
      }
  
      // Download the file using the signed URL
      const fileResponse = await axios.get(signedUrl, { responseType: 'stream' });
      const filePath = path.join(downloadPath, filename);
      const writer = fs.createWriteStream(filePath);
  
      fileResponse.data.pipe(writer);
  
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error: any) {
      if (error.response) {
        console.error(`Error: ${error.response.status} - ${error.response.data}`);
      } else {
        console.error('Error:', error.message);
      }
    }
  }


export async function exportDeposit(depositId: string, downloadPath: string): Promise<void> {
    const depositPopulated = await getDepositById(depositId)
    if (!depositPopulated) {
        throw new Error('depositPopulated cannot be null');
    }
    const deposit: Deposit = {
      title: depositPopulated.title,
      abstract: depositPopulated.abstract,
      disciplines: depositPopulated.disciplines,
      authors: depositPopulated.authors.map((author: any) => ({
        firstName: author.firstName,
        lastName: author.lastName,
        nickName: author.nickName || '',
        email: author.email || '',
        orcid: author.orcid || '',
      })),
      keywords: depositPopulated.keywords,
      community: depositPopulated.communityPopulated.name,
      manuscript:{
          filename: depositPopulated.publicationFile.description,
      }
    };
    const metadataPath = path.join(downloadPath, 'meta.json');
    const manuscriptPath = path.join(downloadPath, depositPopulated.publicationFile.filename);
    fs.writeFileSync(metadataPath, JSON.stringify(deposit, null, 2));
    
    await downloadDepositFile(depositId, depositPopulated.publicationFile.filename, downloadPath);
    const zipFilePath = path.join(downloadPath, `deposit_${depositId}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream(zipFilePath);

    output.on('close', () => {
        console.log(`ZIP file created successfully: ${zipFilePath}`);
    });

    archive.on('error', (err: Error) => {
        throw err;
    });

    archive.pipe(output);
    archive.file(metadataPath, { name: 'meta.json' });
    archive.file(manuscriptPath, { name: deposit.manuscript.filename });

  await archive.finalize();

  // Eliminar archivos temporales si es necesario
  fs.unlinkSync(metadataPath);
  fs.unlinkSync(manuscriptPath);
}