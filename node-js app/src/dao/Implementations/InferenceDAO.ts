import Inference, { InferenceAttributes, InferenceCreationAttributes } from '../../models/Inference';
import IInferenceDAO from '../Interfaces/IInferenceDAO';

class InferenceDAO implements IInferenceDAO {
  async create(inference: InferenceCreationAttributes): Promise<InferenceAttributes> {
    const newInference = await Inference.create(inference);
    return newInference.toJSON() as InferenceAttributes;
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
