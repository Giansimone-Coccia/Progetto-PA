import Content, { ContentAttributes, ContentCreationAttributes } from '../models/Content';
import IContentRepository from '../repositories/Interfaces/IContentRepository';

export class ContentService {
  private contentRepository: IContentRepository;

  constructor(contentRepository: IContentRepository) {
    this.contentRepository = contentRepository;
  }

  async getAllContents(): Promise<ContentAttributes[]> {
    return this.contentRepository.findAll();
  }

  async getContentById(id: number): Promise<ContentAttributes | null> {
    return this.contentRepository.findById(id);
  }

  async createContent(content: ContentCreationAttributes): Promise<ContentAttributes> {
    return this.contentRepository.create(content);
  }

  async updateContent(id: number, content: Partial<ContentAttributes>): Promise<boolean> {
    return this.contentRepository.update(id, content);
  }

  async deleteContent(id: number): Promise<boolean> {
    return this.contentRepository.delete(id);
  }
}
