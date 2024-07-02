import Content from '../models/Content';

export interface IContentRepository {
  findAll(): Promise<Content[]>;
  findById(id: number): Promise<Content | null>;
  create(content: Partial<Content>): Promise<Content>;
  update(id: number, content: Partial<Content>): Promise<Content | null>;
  delete(id: number): Promise<boolean>;
}
