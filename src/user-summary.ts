import axios from "axios";
import * as fs from "fs"; // To save the ZIP file locally
import * as path from "path";
import dotenv from "dotenv";
import { Deposit, DepositPopulated } from "./deposit-interfaces";
import archiver from "archiver";

/**
 * Load and prepare environment variables
 */

dotenv.config();

//Obtain the api key from the env variable
const API_KEY: string | undefined = process.env.API_KEY;
const API_KEY_USER: string | undefined = process.env.API_KEY_USER;

// Function to retrieve a deposit by ID
export async function getUserSummary(
  orcid: string
): Promise<DepositPopulated | null> {
  const apiUrl = `${process.env.API_URL}/users/profile/${orcid}/summary`;
  try {
    // Make the GET request to retrieve deposit details
    const response = await axios.get<DepositPopulated>(apiUrl, {
      headers: {
        "x-api-key": API_KEY,
        "x-api-key-user": API_KEY_USER,
      },
    });
    // Return user contributions details from the response
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error: ${error.response.status} - ${error.response.data}`);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}
