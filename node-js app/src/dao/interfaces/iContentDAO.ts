import { ContentAttributes, ContentCreationAttributes } from '../../models/content';

/**
 * Interface defining methods for Data Access Object (DAO) operations related to Content.
 * These methods outline CRUD (Create, Read, Update, Delete) operations and additional methods for querying content.
 */
interface IContentDAO {
  /**
   * Creates a new content record in the database.
   * @param content - The attributes of the content to create.
   * @returns A promise that resolves with the created content attributes.
   */
  create(content: ContentCreationAttributes): Promise<ContentAttributes>;

  /**
   * Retrieves all content records from the database.
   * @returns A promise that resolves with an array of content attributes.
   */
  findAll(): Promise<ContentAttributes[]>;

  /**
   * Retrieves a content record by its ID from the database.
   * @param id - The ID of the content to find.
   * @returns A promise that resolves with the found content attributes or null if not found.
   */
  findById(id: number): Promise<ContentAttributes | null>;

  /**
   * Updates a content record by its ID in the database with partial updates.
   * @param id - The ID of the content to update.
   * @param updates - The partial content attributes to update.
   * @returns A promise that resolves with true if the content was updated successfully, false otherwise.
   */
  update(id: number, updates: Partial<ContentAttributes>): Promise<boolean>;

  /**
   * Deletes a content record by its ID from the database.
   * @param id - The ID of the content to delete.
   * @returns A promise that resolves with true if the content was deleted successfully, false otherwise.
   */
  delete(id: number): Promise<boolean>;

  /**
   * Retrieves content records associated with a specific dataset ID from the database.
   * @param datasetId - The ID of the dataset to retrieve content for.
   * @returns A promise that resolves with an array of content attributes or null if no content is found.
   */
  findContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null>;
}

export default IContentDAO; // Export the IContentDAO interface
