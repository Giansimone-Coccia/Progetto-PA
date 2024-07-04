import { IRepository } from '../Interfaces/IRepository';
import Content from '../../models/Content';

export class ContentRepositoryImpl implements IRepository<Content> {
  async findAll(): Promise<Content[]> {
    return Content.findAll();
  }

  async findById(id: number): Promise<Content | null> {
    return Content.findByPk(id);
  }

  async create(content: Partial<Content>): Promise<Content> {
    return Content.create(content as Content);
  }

  async update(id: number, content: Partial<Content>): Promise<Content | null> {
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
