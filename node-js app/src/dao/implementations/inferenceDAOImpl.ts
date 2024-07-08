import Inference, { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference';
import IInferenceDAO from '../interfaces/iInferenceDAO';

class InferenceDAO implements IInferenceDAO {

  private static instance: InferenceDAO;

  private constructor() { }

  static getInstance(): InferenceDAO {
    if (!InferenceDAO.instance) {
      InferenceDAO.instance = new InferenceDAO();
    }
    return InferenceDAO.instance;
  }

  async create(inference: InferenceCreationAttributes): Promise<InferenceAttributes> {
    const newInference = await Inference.create(inference);
    return newInference.toJSON() as InferenceAttributes;
  }

  async findAll(): Promise<InferenceAttributes[]> {
    const inferences = await Inference.findAll();
    return inferences.map(inference => inference.toJSON() as InferenceAttributes);
  }

  async findById(id: number): Promise<InferenceAttributes | null> {
    const inference = await Inference.findByPk(id);
    return inference ? inference.toJSON() as InferenceAttributes : null;
  }

  async update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean> {
    const [updatedRows] = await Inference.update(updates, { where: { id } });
    return updatedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await Inference.destroy({ where: { id } });
    return deletedRows > 0;
  }
}

export default InferenceDAO;
