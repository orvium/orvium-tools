/**
 * Represents an author's basic information within the Orvium platform.
 * This interface is used to define the structure of author data throughout the application.
 *
 * @property {string} firstName - The first name of the author.
 * @property {string} lastName - The last name of the author.
 * @property {string} [nickname] - The nickname of the author, if applicable.
 * @property {string} [orcid] - The ORCID identifier for the author, providing a unique identifier that is internationally recognized.
 */
export interface Author {
    firstName: string;
    lastName: string;
    nickName?: string;
    orcid?: string;
}

/**
 * Represents the structure of author data as received from an external data source.
 * This interface is designed to capture detailed author information that might be used to import into
 * or synchronize with the Orvium platform. It includes mandatory and optional fields that accommodate
 * the complexities of data integration from various sources.
 *
 * @property {number} author_id - Unique identifier for the author from the data source.
 * @property {number | null} user_id - Associated user identifier for the author, which may be null if not assigned.
 * @property {string} first_name - The author's first name.
 * @property {string} middle_name - The author's middle name.
 * @property {string} last_name - The author's last name.
 * @property {string} orcid - The ORCID identifier for the author, providing a unique and persistent digital identifier.
 * @property {string} [date_modified] - The last modification date of the author's record, optional and used for synchronization.
 */
export interface InputAuthor {
    author_id: number;
    user_id: number | null;
    first_name: string;
    middle_name: string;
    last_name: string;
    orcid: string;
    date_modified?: string;
}

/**
 * Represents the core data structure for a deposit entry used throughout the application.
 * This interface defines the basic required information needed to create or manage a deposit,
 * typically involving scholarly or research content within a community-managed platform.
 *
 * @property {string} title - The title of the deposit; describes the main subject or focus of the content.
 * @property {string} community - The name or identifier of the community within which the deposit is categorized or managed.
 * @property {string} abstract - A brief summary of the deposit content, providing a clear overview of its purpose and scope.
 * @property {Author[]} authors - An array of Author objects who are credited with the creation or contribution to the deposit content.
 */
export interface Deposit {
    title: string;
    community: string;
    abstract: string;
    authors: Author[];
    disciplines: string[];
    keywords: string[];
    manuscript: {
        filename: string;
    }
}

/**
 * Represents the core data structure for a deposit entry used throughout the application.
 * This interface defines the basic required information needed to create or manage a deposit,
 * typically involving scholarly or research content within a community-managed platform.
 *
 * @property {string} title - The title of the deposit; describes the main subject or focus of the content.
 * @property {string} community - The name or identifier of the community within which the deposit is categorized or managed.
 * @property {string} abstract - A brief summary of the deposit content, providing a clear overview of its purpose and scope.
 * @property {Author[]} authors - An array of Author objects who are credited with the creation or contribution to the deposit content.
 */
export interface DepositPopulated {
    title: string;
    communityPopulated: {
        name: string;
    };
    abstract: string;
    authors: Author[];
    disciplines: string[];
    keywords: string[];
    publicationFile: {
        filename: string;
        description: string;
    }
}

/**
 * Represents the metadata associated with a manuscript that is necessary for managing its storage and retrieval.
 * This interface encapsulates all the essential details needed to handle the manuscript file correctly within
 * storage systems, particularly for operations involving uploads, and archival processes.
 *
 * @property {Object} file - An object containing detailed information about the manuscript file.
 * @property {string} file.name - The filename as it should be stored or referenced in storage systems.
 * @property {string} file.type - The MIME type of the file, indicating the format and nature of the file's content.
 * @property {number} file.size - The size of the file in bytes, important for storage considerations and transfer limits.
 * @property {number} file.lastModified - The timestamp of when the file was last modified, in milliseconds since the UNIX epoch, used for version control and caching strategies.
 */
export interface ManuscriptMetadata {
    file: {
        name: string;           
        type: string;           
        size: number;           
        lastModified: number;  
    }
}

/**
 * Describes the structure of the response received after requesting a signed URL for uploading a manuscript.
 * This interface is crucial for handling file uploads securely and efficiently, providing not only the URL
 * but also the necessary metadata and flags that dictate how the upload should be treated by the system.
 * 
 * @property {string} signedUrl - The pre-signed URL that allows a file to be uploaded directly to a storage service, such as AWS S3.
 * @property {FileMetadata} fileMetadata - Detailed metadata about the file that is being uploaded, including its name, type, size, etc.
 * @property {boolean} isMainFile - A flag indicating whether the file should be treated as the main file in its context, affecting how it is processed and stored.
 * @property {boolean} replacePDF - A flag indicating whether any existing PDF associated with the deposit should be replaced with this file.
 */
export interface UploadSignedUrlResponse {
    signedUrl: string;
    fileMetadata: FileMetadata;
    isMainFile: boolean;
    replacePDF: boolean;
}
 
/**
 * Describes the metadata associated with a file. This metadata facilitates the management, storage,
 * and categorization of files within systems, ensuring files are handled appropriately based on their
 * content type, size, and other characteristics.
 *
 * @interface
 * @property {string} filename - The name of the file including its extension (e.g., 'Manuscript.docs').
 * @property {string} description - A brief description or summary of the file's contents.
 * @property {string} contentType - The MIME type of the file, indicating the file format and nature.
 * @property {number} contentLength - The size of the file in bytes, used during file transfer operations.
 * @property {string[]} tags - A set of tags or keywords associated with the file.
 */
export interface FileMetadata {
    filename: string;
    description: string;
    contentType: string;
    contentLength: number;
    tags: string[];
}
