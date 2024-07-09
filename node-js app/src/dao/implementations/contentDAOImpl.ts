import Content, { ContentAttributes, ContentCreationAttributes } from '../../models/content';
import IContentDAO from '../interfaces/iContentDAO';

/**
 * Data Access Object (DAO) class for interacting with content records.
 * Implements methods to create, read, update, and delete content.
 */
class ContentDAO implements IContentDAO {
  private static instance: ContentDAO; // Singleton instance of ContentDAO

  /**
   * Private constructor to enforce the Singleton pattern.
   * Use ContentDAO.getInstance() to obtain the singleton instance.
   */
  private constructor() {
  }

  /**
   * Static method to get the singleton instance of ContentDAO.
   * @returns The singleton instance of ContentDAO.
   */
  public static getInstance(): ContentDAO {
    if (!ContentDAO.instance) {
      ContentDAO.instance = new ContentDAO();
    }
    return ContentDAO.instance;
  }

  /**
   * Creates a new content record in the database.
   * @param content - The attributes of the content to create.
   * @returns A promise that resolves with the created content attributes.
   */
  async create(content: ContentCreationAttributes): Promise<ContentAttributes> {
    const newContent = await Content.create(content); // Create the new content
    return newContent.toJSON() as ContentAttributes; // Return the created content as JSON
  }

  /**
   * Finds all content records in the database.
   * @returns A promise that resolves with an array of content attributes.
   */
  async findAll(): Promise<ContentAttributes[]> {
    const contents = await Content.findAll(); // Find all contents
    return contents.map(content => content.toJSON() as ContentAttributes); // Map and return the contents as JSON
  }

  /**
   * Finds a content record by its ID in the database.
   * @param id - The ID of the content to find.
   * @returns A promise that resolves with the found content attributes or null if not found.
   */
  async findById(id: number): Promise<ContentAttributes | null> {
    const content = await Content.findByPk(id); // Find content by primary key (ID)
    return content ? content.toJSON() as ContentAttributes : null; // Return the content as JSON or null if not found
  }

  /**
   * Finds content records by dataset ID in the database.
   * @param datasetId - The ID of the dataset to find content for.
   * @returns A promise that resolves with an array of content attributes matching the dataset ID or null if not found.
   */
  async findContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null> {
    const contents = await Content.findAll({ where: { datasetId } }); // Find contents by dataset ID
    return contents ? contents.map(item => item.toJSON() as ContentAttributes) : null; // Map and return the contents as JSON or null if not found
  }

  /**
   * Updates a content record in the database by its ID.
   * @param id - The ID of the content to update.
   * @param updates - The partial content attributes to update.
   * @returns A promise that resolves with true if the content was updated successfully, false otherwise.
   */
  async update(id: number, updates: Partial<ContentAttributes>): Promise<boolean> {
    const [updatedRows] = await Content.update(updates, { where: { id } }); // Update content by ID
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }

  /**
   * Deletes a content record from the database by its ID.
   * @param id - The ID of the content to delete.
   * @returns A promise that resolves with true if the content was deleted successfully, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    const deletedRows = await Content.destroy({ where: { id } }); // Delete content by ID
    return deletedRows > 0; // Return true if rows were deleted, false otherwise
  }
}

export default ContentDAO; // Export the ContentDAO class
