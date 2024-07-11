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
    image: ['image/jpeg', 'image/png'],
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
   * @returns A promise of the total cost of inference for the contents.
   */
  async calculateInferenceCost(contents: ContentAttributes[]): Promise<number> {
    let totalCost = 0;

    for (const currentContent of contents) {
      try {
        switch (currentContent.type) {
          case 'image':
            totalCost += (currentContent.cost / 0.65) * 2.75; // Calculate cost for images
            break;
          case 'zip':
            const mediaCount = await this.countMediaInZip(currentContent.data) || [0, 0]; // Calculate media count in zip
            totalCost += (mediaCount[0] + mediaCount[1]) * 2.75; // Calculate cost for zip files based on image and frame count
            break;
          case 'video':
            totalCost += (currentContent.cost / 0.45) * 2.75; // Calculate cost for videos
            break;
          default:
            console.warn('Unknown content type:', currentContent.type);
            break;
        }
      } catch (error) {
        console.error('Error calculating inference cost for type:', currentContent.type, ' Error:', error);
      }
    }

    return totalCost;
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
    try {
      switch (type) {
        case 'image':
          return 0.65; // Cost calculation for images
        case 'video':
          const frames: number = await this.countFramesInVideo(data);
          return frames * 0.45; // Cost calculation for videos based on frame count
        case 'zip':
          const zipMediaCount = await this.countMediaInZip(data) || [0, 0]; // Calculate media count in zip
          return zipMediaCount[0] * 0.7 + zipMediaCount[1] * 0.5; // Cost calculation for zip files based on image and frame count
        default:
          return null; // Return null if type is unknown
      }
    } catch (error) {
      console.error('Error calculating cost for type:', type, ' Error:', error);
      return null; // Return null in case of any errors
    }
  }

  /**
   * Counts the number of images and video frames in a zip file, including nested zip files.
   * @param data - The Buffer containing zip file data.
   * @returns An array containing the number of images and video frames found in the zip file, or null if an error occurs.
   */
  private async countMediaInZip(data: Buffer): Promise<number[] | null> {
    try {
      const zip = new AdmZip(data); // Initialize AdmZip with provided data
      const zipEntries = zip.getEntries(); // Retrieve entries from the zip file

      const imageCount = [0, 0]; // Initialize array to store counts of images and video frames

      for (const entry of zipEntries) {
        if (entry.name.match(/\.(jpg|jpeg|png)$/i)) {
          // Check if entry is an image file
          imageCount[0]++;
        } else if (entry.name.match(/\.(mp4)$/i)) {
          // Check if entry is a video file
          const videoData = entry.getData(); // Extract video data from the entry
          const frameCount = await this.countFramesInVideo(videoData); // Count frames in the extracted video
          imageCount[1] += frameCount; // Accumulate frame count
        } else if (entry.name.match(/\.zip$/i)) {
          // Check if entry is a zip file
          const nestedZipData = entry.getData(); // Extract nested zip data from the entry
          const nestedCounts = await this.countMediaInZip(nestedZipData); // Recursively count media in the nested zip
          if (nestedCounts) {
            imageCount[0] += nestedCounts[0]; // Accumulate image count from nested zip
            imageCount[1] += nestedCounts[1]; // Accumulate video frame count from nested zip
          }
        }
      }
      return imageCount; // Return array with counts of images and video frames
    } catch (error) {
      console.error('Error counting images and video frames in zip file:', error);
      return null; // Return null in case of error
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
