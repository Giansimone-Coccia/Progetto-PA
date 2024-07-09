import { ContentAttributes, ContentCreationAttributes } from '../../models/content';

// Interface defining methods for interacting with content entities
interface IContentRepository {
  /**
   * Method to create a new content entity.
   * @param content - The attributes of the content to create.
   * @returns Promise resolved with the created ContentAttributes.
   */
  create(content: ContentCreationAttributes): Promise<ContentAttributes>;

  /**
   * Method to retrieve all content entities.
   * @returns Promise resolved with an array of ContentAttributes.
   */
  findAll(): Promise<ContentAttributes[]>;

  /**
   * Method to find a content entity by its ID.
   * @param id - The ID of the content entity to retrieve.
   * @returns Promise resolved with the found ContentAttributes or null if not found.
   */
  findById(id: number): Promise<ContentAttributes | null>;

  /**
   * Method to update a content entity by its ID with partial updates.
   * @param id - The ID of the content entity to update.
   * @param updates - The partial content attributes to update.
   * @returns Promise resolved with true if update is successful, false otherwise.
   */
  update(id: number, updates: Partial<ContentAttributes>): Promise<boolean>;

  /**
   * Method to delete a content entity by its ID.
   * @param id - The ID of the content entity to delete.
   * @returns Promise resolved with true if deletion is successful, false otherwise.
   */
  delete(id: number): Promise<boolean>;

  /**
   * Method to find content entities associated with a specific dataset ID.
   * @param datasetId - The ID of the dataset to find associated content entities.
   * @returns Promise resolved with an array of ContentAttributes or null if not found.
   */
  findContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null>;
}

// Export the IContentRepository interface as the default export
export default IContentRepository;
