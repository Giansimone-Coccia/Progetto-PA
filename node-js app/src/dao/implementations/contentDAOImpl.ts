import Content, { ContentAttributes, ContentCreationAttributes } from '../../models/content';
import IContentDAO from '../interfaces/iContentDAO';

// Content Data Access Object (DAO) class
class ContentDAO implements IContentDAO {
  
  private static instance: ContentDAO; // Singleton instance of ContentDAO

  // Private constructor to enforce the Singleton pattern
  private constructor() {
  }

  // Static method to get the singleton instance of ContentDAO
  public static getInstance(): ContentDAO {
    if (!ContentDAO.instance) {
      ContentDAO.instance = new ContentDAO();
    }
    return ContentDAO.instance;
  }

  // Method to create a new content record
  async create(content: ContentCreationAttributes): Promise<ContentAttributes> {
    const newContent = await Content.create(content); // Create the new content
    return newContent.toJSON() as ContentAttributes; // Return the created content as JSON
  }

  // Method to find all content records
  async findAll(): Promise<ContentAttributes[]> {
    const contents = await Content.findAll(); // Find all contents
    return contents.map(content => content.toJSON() as ContentAttributes); // Map and return the contents as JSON
  }

  // Method to find a content record by its ID
  async findById(id: number): Promise<ContentAttributes | null> {
    const content = await Content.findByPk(id); // Find content by primary key (ID)
    return content ? content.toJSON() as ContentAttributes : null; // Return the content as JSON or null if not found
  }

  // Method to find content records by dataset ID
  async findContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null> {
    const contents = await Content.findAll({ where: { datasetId } }); // Find contents by dataset ID
    return contents ? contents.map((item) => item.toJSON() as ContentAttributes) : null; // Map and return the contents as JSON or null if not found
  }

  // Method to update a content record by its ID
  async update(id: number, updates: Partial<ContentAttributes>): Promise<boolean> {
    const [updatedRows] = await Content.update(updates, { where: { id } }); // Update content by ID
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }

  // Method to delete a content record by its ID
  async delete(id: number): Promise<boolean> {
    const deletedRows = await Content.destroy({ where: { id } }); // Delete content by ID
    return deletedRows > 0; // Return true if rows were deleted, false otherwise
  }
}

export default ContentDAO; // Export the ContentDAO class
