import { ContentAttributes, ContentCreationAttributes } from '../../models/content';

// Interface defining methods for Data Access Object (DAO) operations related to Content
interface IContentDAO {
  // Method to create a new content record
  create(content: ContentCreationAttributes): Promise<ContentAttributes>;

  // Method to find all content records
  findAll(): Promise<ContentAttributes[]>;

  // Method to find a content record by its ID
  findById(id: number): Promise<ContentAttributes | null>;

  // Method to update a content record by its ID with partial updates
  update(id: number, updates: Partial<ContentAttributes>): Promise<boolean>;

  // Method to delete a content record by its ID
  delete(id: number): Promise<boolean>;

  // Method to find content records by dataset ID
  findContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null>;
}

export default IContentDAO; // Export the IContentDAO interface
