import Content, { ContentAttributes, ContentCreationAttributes } from '../../models/content';
import IContentDAO from '../interfaces/iContentDAO';

class ContentDAO implements IContentDAO {
  async create(content: ContentCreationAttributes): Promise<ContentAttributes> {
    const newContent = await Content.create(content);
    return newContent.toJSON() as ContentAttributes;
  }

  async findAll(): Promise<ContentAttributes[]> {
    const contents = await Content.findAll();
    return contents.map(content => content.toJSON() as ContentAttributes);
  }  

  async findById(id: number): Promise<ContentAttributes | null> {
    const content = await Content.findByPk(id);
    return content ? content.toJSON() as ContentAttributes : null;
  }

  async findContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null> {
    const contents = await Content.findAll({ where: { datasetId } });
    return contents ? contents.map((item) => item.toJSON() as ContentAttributes) : null;
  }
  
  async update(id: number, updates: Partial<ContentAttributes>): Promise<boolean> {
    const [updatedRows] = await Content.update(updates, { where: { id } });
    return updatedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await Content.destroy({ where: { id } });
    return deletedRows > 0;
  }
}

export default ContentDAO;
