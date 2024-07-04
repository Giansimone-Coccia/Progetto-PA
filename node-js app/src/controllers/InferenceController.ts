import { Request, Response } from 'express';
import { InferenceService } from '../services/InferenceService';
import InferenceRepositoryImpl from '../repositories/Implementations/InferenceRepositoryImpl';
import InferenceDAO from '../dao/Implementations/InferenceDAO';

const inferenceDAO = new InferenceDAO()
const inferenceRepository = new InferenceRepositoryImpl(inferenceDAO);
const inferenceService = new InferenceService(inferenceRepository);

export const getAllInferences = async (req: Request, res: Response) => {
  const inferences = await inferenceService.getAllInferences();
  res.json(inferences);
};

export const getInferenceById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const inference = await inferenceService.getInferenceById(id);
  if (inference) {
    res.json(inference);
  } else {
    res.status(404).json({ message: 'Inference not found' });
  }
};

export const createInference = async (req: Request, res: Response) => {
  const inference = await inferenceService.createInference(req.body);
  res.status(201).json(inference);
};

export const updateInference = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const inference = await inferenceService.updateInference(id, req.body);
  if (inference) {
    res.json(inference);
  } else {
    res.status(404).json({ message: 'Inference not found' });
  }
};

export const deleteInference = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const success = await inferenceService.deleteInference(id);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Inference not found' });
  }
};
