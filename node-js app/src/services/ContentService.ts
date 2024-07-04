import Content, { ContentAttributes, ContentCreationAttributes } from '../models/content';
import IContentRepository from '../repositories/interfaces/iContentRepository';

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

  static calculateCost(type: string): number | null {
    switch (type) {
      case 'jpg':
      case 'png':
        return 0.65;
      case 'mp4':
      case 'zip':
        // Add specific logic if needed
        return 1.2;
      default:
        return null; // Invalid type
    }
  }
}
