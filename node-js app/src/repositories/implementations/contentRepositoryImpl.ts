import ContentDAO from '../../dao/implementations/contentDAOImpl';
import IContentDAO from '../../dao/interfaces/iContentDAO';
import { ContentAttributes, ContentCreationAttributes } from '../../models/content';
import IContentRepository from '../interfaces/iContentRepository';

class ContentRepository implements IContentRepository {
  private static instance: ContentRepository;
  private contentDAO: IContentDAO;

  private constructor() {
    this.contentDAO = ContentDAO.getInstance();
  }

  static getInstance(){
    if (!this.instance) {
      this.instance = new ContentRepository();
    }
    return this.instance;
  }

  async create(content: ContentCreationAttributes): Promise<ContentAttributes> {
    return this.contentDAO.create(content);
  }

  async findAll(): Promise<ContentAttributes[]> {
    return this.contentDAO.findAll();
  }

  async findById(id: number): Promise<ContentAttributes | null> {
    return this.contentDAO.findById(id);
  }

  async findContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null> {
    return this.contentDAO.findContentByDatasetId(datasetId);
  }

  async update(id: number, updates: Partial<ContentAttributes>): Promise<boolean> {
    return this.contentDAO.update(id, updates);
  }

  async delete(id: number): Promise<boolean> {
    return this.contentDAO.delete(id);
  }
}

export default ContentRepository;
