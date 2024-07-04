import { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference';

interface IInferenceRepository {
  create(inference: InferenceCreationAttributes): Promise<InferenceAttributes>;
  findAll(): Promise<InferenceAttributes[]>;
  findById(id: number): Promise<InferenceAttributes | null>;
  update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

export default IInferenceRepository;
