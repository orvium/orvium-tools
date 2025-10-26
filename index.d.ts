declare module '@orvium/orvium-tools' {
    /**
     * Imports a deposit into an Orvium community.
     * @param directoryPath - Path to the folder containing the deposit metadata and manuscript files.
     * @param community - The name of the Orvium community where the deposit should be uploaded.
     * @returns A promise that resolves when the deposit is successfully imported.
     */
    export function importDeposit(directoryPath: string, community: string): Promise<void>;
  
    /**
     * Exports a deposit from Orvium.
     * @param depositId - The unique identifier of the deposit to export.
     * @param directoryPath - Path to the folder where the zip file will be downloaded.
     * @returns A promise that resolves when the deposit is successfully exported.
     */
    export function exportDeposit(depositId: string, directoryPath: string): Promise<void>;
  }