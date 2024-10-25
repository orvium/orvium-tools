/**
 * Importer module for managing deposits and manuscript uploads to the Orvium platform.
 *
 * This module handles the full process of importing deposit data (including author information, 
 * metadata, keywords, community, and manuscript files) to the Orvium platform:
 *
 * - Load metadata from a local JSON file.
 * - Transform author data into the appropriate format for the Orvium platform.
 * - Create a deposit entry by sending the metadata and author information to the platform.
 * - Generate a signed URL for securely uploading the manuscript to a cloud storage service (e.g., AWS S3).
 * - Upload the manuscript file using the pre-signed URL.
 * - Confirm the successful upload by sending metadata to the platform.
 *
 * The module uses `dotenv` for environment variables, `axios` for HTTP requests, and `fs` and `path` 
 * for file operations. It is designed to be used in automation processes or integrated into other
 * applications for deposit and manuscript management.
 *
 */ 
import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';
import {  Author, InputAuthor, Deposit, ManuscriptMetadata, UploadSignedUrlResponse }from './deposit-interfaces';

/**
 * Load and prepare environment variables
 */

dotenv.config();

//Obtain the api key from the env variable
const API_KEY: string | undefined = process.env.API_KEY;  
const API_KEY_USER: string | undefined = process.env.API_KEY_USER;

// Define the base URL and the required endpoint from the environment variables
const API_URL: string | undefined = process.env.API_URL;
const DEPOSIT_IMPORT_ENDPOINT: string = `${API_URL}/deposits/importBasicDeposit`;
const UPLOAD_ENDPOINT = `${API_URL}/deposits/:id/files`;

// Check if the necessary environment variable are provided, otherwise exit
if (!API_KEY || !API_KEY_USER || !API_URL) {
  console.error('Missing required environment variables: API_KEY, API_USER and API_URL are not set.');
  process.exit(1);  // Exit the process with a status code of 1 for an error
}


/**
 * Loads a JSON file from the specified file path and returns its content as an object.
 * This function synchronously reads the file located at the given path and parses the JSON content.
 *
 * @param {string} directoryPath - The relative or absolute path to the dir with the meta JSON file to be loaded.
 * @returns {Object} Returns the parsed JSON object from the file.
 * @throws {Error} Throws an error if the file cannot be read or if the JSON cannot be parsed.
 */
function loadJsonFile(directoryPath: string) {
 
 // Append 'meta.json' to the provided directory path
 const metaPath: string = path.join(directoryPath, 'meta.json'); 
 
 try {
      // Reading the meta data json file  
      const absolutePath = path.resolve(metaPath); 
      const metaData = fs.readFileSync(absolutePath, 'utf8');
      return JSON.parse(metaData);
  } catch (error) {
      console.error('Error reading JSON file:', error);
      throw error;
  }
}

/**
 * Prepares the file payload including metadata such as name, type, size, and last modification time.
 * This function is specifically structured to fetch file metadata synchronously.
 *
 * @param {string} manuscriptPath - The full path to the file.
 * @returns {object} The file payload object necessary for uploads.
 */
function createManuscriptMetadata(manuscriptPath: string): ManuscriptMetadata {
  
    const fileStats = fs.statSync(manuscriptPath);  // Get file statistics synchronously

    return {
            file: {
                name: path.basename(manuscriptPath),  // Extract the filename from the path
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // MIME type (adjust as necessary)
                size: fileStats.size,  // File size in bytes
                lastModified: fileStats.mtimeMs  // Last modified time in milliseconds
            }
    };
}

/**
 * Transforms an author object from the input format to the desired format to be imported.
 * 
 * @param {InputAuthor} inputAuthor - The author object in the input format containing the required properties.
 * @returns {Author} Returns a new author object with properties formatted as firstName, lastName, and orcid.
 * 
 */
function transformAuthor(inputAuthor: InputAuthor): Author {
    return {
        firstName: inputAuthor.first_name,
        lastName: inputAuthor.last_name,
        orcid: inputAuthor.orcid,
    };
}

/**
 * Submits a deposit object to a server via a POST request and returns the unique deposit ID.
 * It expects the server response to include a unique identifier for the newly created deposit, which it then returns.
 *
 * @param {Deposit} deposit - The deposit object to be sent to the server. 
 * @returns {Promise<string>} A promise that resolves with the deposit's unique identifier as a string.
 * @throws {Error} Throws an error if the deposit ID is not included in the server's response or if there is an issue with the HTTP request.
 */
async function importSingleDeposit(deposit: Deposit): Promise<string> {
    try {  
        const depositWithoutManuscript = (({ manuscript, ...rest }) => rest)(deposit);
        const response: AxiosResponse<any> = await axios.post(DEPOSIT_IMPORT_ENDPOINT, depositWithoutManuscript, {
        headers: { 
            'x-api-key': API_KEY,
            'x-api-key-user': API_KEY_USER }
      });
  
      if (response.data && response.data._id) {
        return response.data._id; // Return the deposit ID
      } else {
        throw new Error('Deposit ID not found in the response');
      }
    } catch (error: any) {
      console.error('Error importing deposit:', error.response?.data || error.message);
      throw error; // Properly handle the error by throwing
    }
}

/**
 * Asynchronously generates a signed URL for uploading a manuscript to S3, using manuscript metadata and deposit ID.
 * This function makes a POST request to a specified endpoint to obtain a signed URL, which can then be used to upload the manuscript.
 *
 * @param {string} depositId - The unique identifier for the deposit to which the manuscript will be uploaded.
 * @param {ManuscriptMetadata} manuscriptMetadata - The metadata for the manuscript that needs to be uploaded, including file name, type, size, etc.
 * @returns {Promise<string>} A promise that resolves with the signed URL needed for uploading the manuscript.
 * @throws {Error} Throws an error if the signed URL is not obtained from the response or if there is a network or server error.
 */ 
async function generateManuscriptUploadUrl(depositId: string, manuscriptMetadata: ManuscriptMetadata): Promise<UploadSignedUrlResponse> {
    const url = `${UPLOAD_ENDPOINT.replace(':id', depositId)}?isMainFile=true&replacePDF=false`;
    try {
        const response = await axios.post(url, manuscriptMetadata, {
            headers: {
                'x-api-key': API_KEY,
                'x-api-key-user': API_KEY_USER // Use API key for authentication
            }
        });

        if (response) {
            return response.data; // Return the signed URL to upload the manuscritp
          } else {
            throw new Error('Upload Signed Url not obtained');
          }
    } catch (error: any) {
        console.error('Error getting the signed URL to upload the manuscript:', error.response?.data || error.message);
        throw error; // Properly handle the error by throwing
    }  
}

/**
 * Uploads a manuscript to an S3 bucket using a pre-signed URL obtained from a service.
 * This function handles the streaming upload of a manuscript file located in a specified directory
 * to an Amazon S3 bucket using an HTTP PUT request. The necessary headers for the request, such as
 * Content-Type and Content-Length, are set based on the provided manuscript metadata.
 *
 * @param {string} manuscriptPath - The manuscript path where the manuscript is stored locally.
 * @param {UploadSignedUrlResponse} uploadSignedUrlResponse - The response object containing the signed URL and other upload parameters.
 * @param {ManuscriptMetadata} manuscriptMetadata - Metadata about the manuscript, including the file size and other attributes.
 * @returns {Promise<AxiosResponse>} A promise that resolves with the response from the S3 service upon successful upload.
 * @throws {Error} An error is thrown if the upload fails, with a message detailing the cause of the failure.
 */
async function uploadManuscriptToSignedUrl(manuscriptPath: string, uploadSignedUrlResponse: UploadSignedUrlResponse, manuscriptMetadata: ManuscriptMetadata) {
    
    const manuscritpStream = fs.createReadStream(manuscriptPath);
    
    try {
        const response = await axios.put(uploadSignedUrlResponse.signedUrl, manuscritpStream, {
            headers: {
                  'Content-Type': 'application/octet-stream', // Set appropriate content type
                  'Content-Length': manuscriptMetadata.file.size, // AWS S3 needs Content-Length set for PUT operations
                }
          });
        return response;
    } catch (error: any) {
        console.error('Error uploading manuscript to signed URL:', error.message);
        throw error; // Properly handle the error by throwing
    }  
}

/**
 * Confirms the upload of a manuscript by sending metadata (excluding the signed URL) to a server endpoint.
 * This function makes an HTTP PATCH request to the server to confirm that a manuscript has been successfully
 * uploaded to the designated storage based on the provided deposit ID. The function uses part of the upload
 * response (metadata without the signed URL) to make this confirmation.
 *
 * @param {string} depositId - The unique identifier for the deposit to which the manuscript has been uploaded.
 * @param {UploadSignedUrlResponse} uploadSignedUrlResponse - The response object from the upload attempt,
 *        containing the signed URL and other manuscript metadata.
 * @returns {Promise<AxiosResponse>} A promise that resolves with the server's response to the confirmation request.
 * @throws {Error} Throws an error if the confirmation fails, with a message detailing the cause of the failure.
 */
async function confirmManuscriptImported(depositId: string, uploadSignedUrlResponse: UploadSignedUrlResponse  ) {
    const confirm_url = `${API_URL}/deposits/${depositId}/files/confirm`; 
    const { signedUrl, ...manuscriptImportedMetadata } = uploadSignedUrlResponse;
    try {
        const confirmResponse = await axios.patch(confirm_url, manuscriptImportedMetadata, {
            headers: {
                'x-api-key': API_KEY, // Use API key for authentication
                'x-api-key-user': API_KEY_USER
            }
        });
        return confirmResponse;
    } catch (error: any) {
        console.error('Error confirming the manuscript upload:', error.message);
        throw error; // Properly handle the error by throwing
    }  
}


/**
 * Handles the full process of importing a deposit based on metadata loaded from a specified directory.
 * This function orchestrates several steps to fully integrate a manuscript into the system: it loads metadata,
 * creates a deposit, uploads the manuscript to a pre-signed URL, and finally confirms the manuscript upload.
 *
 * @param directoryPath - Directory with the deposit manuscript and metadata
 * @param community - Orvium community where the deposit will be uploaded
 * @returns {Promise<void>} - A promise that resolves if the entire deposit process completes successfully.
 * @throws {Error} - Throws an error if any step in the deposit, upload, or confirmation process fails.
 */  
export async function importDeposit(directoryPath: string, community: string): Promise<void> {
    try {
        const metaData = loadJsonFile(directoryPath);
    
        const deposit: Deposit = {
            title: metaData.title,
            abstract: metaData.abstract,
            community: community, 
            authors: metaData.authors.map(transformAuthor),
            disciplines: metaData.disciplines,
            keywords: metaData.keywords, 
            manuscript: {
                filename: metaData.manuscript.filename,
            }
        }

        //Extract the manuscript name and type from metadata.json
        const manuscriptName = deposit.manuscript.filename;

        // Import the deposit and get the deposit ID
        const depositId = await importSingleDeposit(deposit);
 
        // Getting SignedUrl
        const manuscriptPath: string = path.join(directoryPath, manuscriptName); 
        const manuscriptMetadata = await createManuscriptMetadata(manuscriptPath);
        const uploadSignedUrlResponse = await generateManuscriptUploadUrl(depositId, manuscriptMetadata);

        // Upload to signedUrl
        const uploadStatus = await uploadManuscriptToSignedUrl(manuscriptPath, uploadSignedUrlResponse, manuscriptMetadata);
        
        // Confirm and change metadata
        await confirmManuscriptImported(depositId, uploadSignedUrlResponse); 
        console.log('Deposit imported Successfully: ', deposit.title);



    } catch (error) {
        console.error('An error occurred during import or upload:', error);
    }
  }