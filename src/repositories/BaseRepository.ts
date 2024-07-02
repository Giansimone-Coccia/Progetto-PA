// src/repositories/BaseRepository.ts

import { Model, ModelCtor } from 'sequelize';

export interface BaseRepository<T extends Model<any, any>> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

export abstract class BaseRepositoryImpl<T extends Model<any, any>> implements BaseRepository<T> {
  constructor(private readonly model: ModelCtor<T>) {}

  async findAll(): Promise<T[]> {
    return this.model.findAll();
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const record = await this.model.findByPk(id);
    if (!record) {
      return null;
    }
    await record.update(data);
    return record;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.model.destroy({ where: { id } });
    return result === 1;
  }
}
