import IContentDAO from '../../dao/Interfaces/IContentDAO';
import { ContentAttributes, ContentCreationAttributes } from '../../models/Content';
import IContentRepository from '../Interfaces/IContentRepository';

class ContentRepository implements IContentRepository {
  private contentDAO: IContentDAO;

  constructor(contentDAO: IContentDAO) {
    this.contentDAO = contentDAO;
  }

  async create(content: ContentCreationAttributes): Promise<ContentAttributes> {
    return this.contentDAO.create(content);
  }

  async findById(id: number): Promise<ContentAttributes | null> {
    return this.contentDAO.findById(id);
  }

  async update(id: number, updates: Partial<ContentAttributes>): Promise<boolean> {
    return this.contentDAO.update(id, updates);
  }

  async delete(id: number): Promise<boolean> {
    return this.contentDAO.delete(id);
  }
}

export default ContentRepository;
