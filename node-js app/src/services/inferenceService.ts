import { InferenceAttributes, InferenceCreationAttributes } from '../models/inference';
import InferenceRepository from '../repositories/implementations/inferenceRepositoryImpl';
import IInferenceRepository from '../repositories/interfaces/iInferenceRepository';

/**
 * Service class for managing inference-related operations.
 */
export class InferenceService {
  private static instance: InferenceService;
  private inferenceRepository: IInferenceRepository;

  /**
   * Private constructor initializes InferenceRepository instance.
   */
  private constructor() {
    this.inferenceRepository = InferenceRepository.getInstance();
  }

  /**
   * Retrieves the singleton instance of InferenceService.
   * @returns The singleton instance of InferenceService.
   */
  static getInstance(): InferenceService {
    if (!this.instance) {
      this.instance = new InferenceService();
    }
    return this.instance;
  }

  /**
   * Retrieves all inferences from the repository.
   * @returns A promise that resolves to an array of InferenceAttributes.
   */
  async getAllInferences(): Promise<InferenceAttributes[]> {
    return this.inferenceRepository.findAll();
  }

  /**
   * Retrieves inference by ID from the repository.
   * @param id - The ID of the inference to retrieve.
   * @returns A promise that resolves to InferenceAttributes if found, otherwise null.
   */
  async getInferenceById(id: number): Promise<InferenceAttributes | null> {
    return this.inferenceRepository.findById(id);
  }

  /**
   * Creates new inference in the repository.
   * @param inference - The inference data to create.
   * @returns A promise that resolves to the created InferenceAttributes.
   */
  async createInference(inference: InferenceCreationAttributes): Promise<InferenceAttributes> {
    return this.inferenceRepository.create(inference);
  }

  /**
   * Updates existing inference in the repository.
   * @param id - The ID of the inference to update.
   * @param inference - The partial inference data to update.
   * @returns A promise that resolves to true if update was successful, otherwise false.
   */
  async updateInference(id: number, inference: Partial<InferenceAttributes>): Promise<boolean> {
    return this.inferenceRepository.update(id, inference);
  }

  /**
   * Deletes inference from the repository.
   * @param id - The ID of the inference to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  async deleteInference(id: number): Promise<boolean> {
    return this.inferenceRepository.delete(id);
  }
}
