import { Request, Response } from 'express';
import { InferenceService } from '../services/inferenceService';
import InferenceRepositoryImpl from '../repositories/implementations/inferenceRepositoryImpl';
import InferenceDAO from '../dao/implementations/inferenceDAOImpl';

class InferenceController {
  private inferenceService: InferenceService;

  constructor() {
    const inferenceDAO = new InferenceDAO();
    const inferenceRepository = new InferenceRepositoryImpl(inferenceDAO);
    this.inferenceService = new InferenceService(inferenceRepository);
  }

  getAllInferences = async (req: Request, res: Response) => {
    const inferences = await this.inferenceService.getAllInferences();
    res.json(inferences);
  };

  getInferenceById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const inference = await this.inferenceService.getInferenceById(id);
    if (inference) {
      res.json(inference);
    } else {
      res.status(404).json({ message: 'Inference not found' });
    }
  };

  createInference = async (req: Request, res: Response) => {
    const inference = await this.inferenceService.createInference(req.body);
    res.status(201).json(inference);
  };

  updateInference = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const inference = await this.inferenceService.updateInference(id, req.body);
    if (inference) {
      res.json(inference);
    } else {
      res.status(404).json({ message: 'Inference not found' });
    }
  };

  deleteInference = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const success = await this.inferenceService.deleteInference(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Inference not found' });
    }
  };
}

export default InferenceController;
