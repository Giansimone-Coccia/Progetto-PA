import { IRepository } from '../IRepository';
import Content from '../../models/Content';
import { ContentAttributes } from '../../models/Content';

export class ContentRepositoryImpl implements IRepository<ContentAttributes> {
  async findAll(): Promise<ContentAttributes[]> {
    return Content.findAll();
  }

  async findById(id: number): Promise<ContentAttributes | null> {
    return Content.findByPk(id);
  }

  async create(content: Partial<ContentAttributes>): Promise<ContentAttributes> {
    return Content.create(content as ContentAttributes);
  }

  async update(id: number, content: Partial<ContentAttributes>): Promise<ContentAttributes | null> {
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
