import { ContentAttributes, ContentCreationAttributes } from '../models/content'; // Importing Content model
import IContentRepository from '../repositories/interfaces/iContentRepository'; // Importing Content repository interface
import AdmZip = require('adm-zip'); // Importing adm-zip for working with zip files
import { spawn } from 'child_process'; // Importing spawn from child_process module for spawning subprocesses
import ContentRepository from '../repositories/implementations/contentRepositoryImpl'; // Importing Content repository implementation

/**
 * Service class for managing content-related operations.
 */
export class ContentService {
  private static instance: ContentService;
  private contentRepository: IContentRepository;

  /**
   * Private constructor to initialize ContentRepository instance.
   */
  private constructor() {
    this.contentRepository = ContentRepository.getInstance();
  }

  /**
   * Retrieves the singleton instance of ContentService.
   * @returns The singleton instance of ContentService.
   */
  static getInstance(): ContentService {
    if (!this.instance) {
      this.instance = new ContentService();
    }
    return this.instance;
  }

  /**
   * Retrieves all contents from the repository.
   * @returns A promise that resolves to an array of ContentAttributes.
   */
  async getAllContents(): Promise<ContentAttributes[]> {
    return this.contentRepository.findAll();
  }

  /**
   * Retrieves content by ID from the repository.
   * @param id - The ID of the content to retrieve.
   * @returns A promise that resolves to ContentAttributes if found, otherwise null.
   */
  async getContentById(id: number): Promise<ContentAttributes | null> {
    return this.contentRepository.findById(id);
  }

  /**
   * Retrieves contents by dataset ID from the repository.
   * @param datasetId - The ID of the dataset to retrieve contents for.
   * @returns A promise that resolves to an array of ContentAttributes if found, otherwise null.
   */
  async getContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null> {
    return this.contentRepository.findContentByDatasetId(datasetId);
  }

  /**
   * Creates new content in the repository.
   * @param content - The content data to create.
   * @returns A promise that resolves to the created ContentAttributes.
   */
  async createContent(content: ContentCreationAttributes): Promise<ContentAttributes> {
    return this.contentRepository.create(content);
  }

  /**
   * Updates existing content in the repository.
   * @param id - The ID of the content to update.
   * @param content - The partial content data to update.
   * @returns A promise that resolves to true if update was successful, otherwise false.
   */
  async updateContent(id: number, content: Partial<ContentAttributes>): Promise<boolean> {
    return this.contentRepository.update(id, content);
  }

  /**
   * Deletes content from the repository.
   * @param id - The ID of the content to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  async deleteContent(id: number): Promise<boolean> {
    return this.contentRepository.delete(id);
  }

  /**
   * Mapping of MIME types to allowed types for validation.
   */
  static mimeTypesMapping: Record<string, string[]> = {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    video: ['video/mp4'],
    zip: ['application/zip']
  };

  /**
   * Checks if a given MIME type is allowed based on type.
   * @param type - The type of content ('image', 'video', 'zip').
   * @param mimetype - The MIME type to check.
   * @returns true if the MIME type is allowed for the specified type, otherwise false.
   */
  static checkMimetype(type: string, mimetype: string): boolean {
    const allowedMimeTypes = ContentService.mimeTypesMapping[type];
    return allowedMimeTypes ? allowedMimeTypes.includes(mimetype) : false;
  }

  /**
   * Calculates the total cost of inference for a set of contents.
   * @param contents - An array of ContentAttributes for which to calculate the cost.
   * @returns The total cost of inference for the contents.
   */
  calculateInferenceCost(contents: ContentAttributes[]): number {
    return contents.reduce((accumulator, currentContent) => {
      if (currentContent.type === 'image') {
        accumulator += (currentContent.cost / 0.65) * 2.75
      }
      else if (currentContent.type === 'zip') {
        accumulator += (currentContent.cost / 0.7) * 2.75
      }
      else {
        accumulator += (currentContent.cost / 0.45) * 2.75
      }
      return accumulator;
    }, 0);
  }

  /**
   * Reduces contents to a format suitable for inference processing.
   * @param contents - An array of ContentAttributes to reduce.
   * @returns A nested array containing [name, type, data] for each content.
   */
  reduceContents(contents: ContentAttributes[]): (string | Buffer)[][] {
    return contents.map(content => [content.name, content.type, content.data]);
  }

  /**
   * Calculates the cost of a specific content based on its type and data.
   * @param type - The type of the content ('image', 'video', 'zip').
   * @param data - The content data (Buffer) for which to calculate the cost.
   * @returns A promise that resolves to the calculated cost of the content, or null if type is unknown.
   */
  async calculateCost(type: string, data: Buffer): Promise<number | null> {
    switch (type) {
      case 'image':
        return 0.65; // Cost calculation for images
      case 'video':
        const frames: number = await this.countFramesInVideo(data);
        return frames * 0.45; // Cost calculation for videos based on frame count
      case 'zip':
        return (this.countImagesInZip(data) || 0) * 0.7; // Cost calculation for zip files based on image count
      default:
        return null;
    }
  }

  /**
   * Counts the number of images in a zip file.
   * @param data - The Buffer containing zip file data.
   * @returns The number of images found in the zip file, or null if an error occurs.
   */
  private countImagesInZip(data: Buffer): number | null {
    try {
      const zip = new AdmZip(data); // Initialize AdmZip with provided data

      const zipEntries = zip.getEntries(); // Retrieve entries from the zip file

      let imageCount = 0;
      zipEntries.forEach(entry => {
        if (entry.name.match(/\.(jpg|jpeg|png)$/i)) { // Check if entry is an image file
          imageCount++;
        }
      });

      return imageCount;
    } catch (error) {
      console.error('Error counting images in zip file:', error);
      return null;
    }
  }

  /**
   * Counts the number of frames in a video using ffprobe.
   * @param data - The Buffer containing video data.
   * @returns A promise that resolves to the number of frames in the video.
   */
  private async countFramesInVideo(data: Buffer): Promise<number> {
    const ffprobeCommand = 'ffprobe'; // Command to execute ffprobe
    const args = [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=nb_frames',
      '-of', 'default=nokey=1:noprint_wrappers=1',
      '-'
    ];

    return new Promise((resolve, reject) => {
      const ffprobeProcess = spawn(ffprobeCommand, args); // Spawn ffprobe process

      let frameCount = 0;

      // Write buffer data to ffprobe process
      ffprobeProcess.stdin.write(data);
      ffprobeProcess.stdin.end();

      // Event listeners for process stdout, stderr, and process close
      ffprobeProcess.stdout.on('data', (data) => {
        const frames = parseInt(data.toString().trim(), 10);
        if (!isNaN(frames)) {
          frameCount = frames;
        }
      });

      ffprobeProcess.stderr.on('data', (data) => {
        console.error(`Error during frame count: ${data}`);
      });

      ffprobeProcess.on('close', (code) => {
        if (code === 0) {
          resolve(frameCount);
        } else {
          reject(new Error(`ffprobe exited with code ${code}`));
        }
      });

      ffprobeProcess.on('error', (err) => {
        console.error(`Error executing ffprobe: ${err}`);
        reject(err);
      });
    });
  }
}
