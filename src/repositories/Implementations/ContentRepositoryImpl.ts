import { IContentRepository } from '../ContentRepository';
import Content from '../../models/Content';
import { ContentAttributes } from '../../models/Content';

export class ContentRepositoryImpl implements IContentRepository {
  async findAll(): Promise<Content[]> {
    return Content.findAll();
  }

  async findById(id: number): Promise<Content | null> {
    return Content.findByPk(id);
  }

  async create(content: Partial<ContentAttributes>): Promise<Content> {
    return Content.create(content as ContentAttributes);
  }

  async update(id: number, content: Partial<ContentAttributes>): Promise<Content | null> {
    const existingContent = await Content.findByPk(id);
    if (!existingContent) {
      return null;
    }
    return existingContent.update(content);
  }

  async delete(id: number): Promise<boolean> {
    const result = await Content.destroy({ where: { id } });
    return result > 0;
  }
}
