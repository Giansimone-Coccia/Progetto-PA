import Dataset from '../models/Dataset';

export interface IDatasetRepository {
  findAll(): Promise<Dataset[]>;
  findById(id: number): Promise<Dataset | null>;
  create(dataset: Partial<Dataset>): Promise<Dataset>;
  update(id: number, dataset: Partial<Dataset>): Promise<Dataset | null>;
  delete(id: number): Promise<boolean>;
}
