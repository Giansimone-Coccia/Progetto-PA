import ContentDAO from '../../dao/implementations/contentDAOImpl'; // Importing ContentDAO for data access operations
import IContentDAO from '../../dao/interfaces/iContentDAO'; // Importing interface for ContentDAO
import { ContentAttributes, ContentCreationAttributes } from '../../models/content'; // Importing content model attributes
import IContentRepository from '../interfaces/iContentRepository'; // Importing interface for ContentRepository

// Repository class implementing IContentRepository interface
class ContentRepository implements IContentRepository {
  private static instance: ContentRepository;
  private readonly contentDAO: IContentDAO;

  // Private constructor initializes ContentDAO instance
  private constructor() {
    this.contentDAO = ContentDAO.getInstance();
  }

  // Singleton pattern: Get instance of ContentRepository
  static getInstance() {
    if (!this.instance) {
      this.instance = new ContentRepository();
    }
    return this.instance;
  }

  /**
   * Creates new content using DAO method.
   * @param content - The content creation attributes.
   * @returns Promise resolved with the created content attributes.
   */
  async create(content: ContentCreationAttributes): Promise<ContentAttributes> {
    return this.contentDAO.create(content);
  }

  /**
   * Retrieves all contents using DAO method.
   * @returns Promise resolved with an array of ContentAttributes.
   */
  async findAll(): Promise<ContentAttributes[]> {
    return this.contentDAO.findAll();
  }

  /**
   * Retrieves content by ID using DAO method.
   * @param id - The ID of the content to retrieve.
   * @returns Promise resolved with the found ContentAttributes or null if not found.
   */
  async findById(id: number): Promise<ContentAttributes | null> {
    return this.contentDAO.findById(id);
  }

  /**
   * Retrieves contents by dataset ID using DAO method.
   * @param datasetId - The ID of the dataset to retrieve contents for.
   * @returns Promise resolved with an array of ContentAttributes or null if not found.
   */
  async findContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null> {
    return this.contentDAO.findContentByDatasetId(datasetId);
  }

  /**
   * Updates content by ID with partial updates using DAO method.
   * @param id - The ID of the content to update.
   * @param updates - The partial content attributes to update.
   * @returns Promise resolved with true if update is successful, false otherwise.
   */
  async update(id: number, updates: Partial<ContentAttributes>): Promise<boolean> {
    return this.contentDAO.update(id, updates);
  }

  /**
   * Deletes content by ID using DAO method.
   * @param id - The ID of the content to delete.
   * @returns Promise resolved with true if deletion is successful, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    return this.contentDAO.delete(id);
  }
}

// Export ContentRepository class as default export
export default ContentRepository;
