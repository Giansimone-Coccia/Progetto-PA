import { Request, Response } from 'express';
import { DatasetService } from '../services/DatasetService';
import DatasetRepositoryImpl from '../repositories/Implementations/DatasetRepositoryImpl';
import DatasetDAO from '../dao/Implementations/DatasetDAOImpl';

const datasetDAO = new DatasetDAO()
const datasetRepository = new DatasetRepositoryImpl(datasetDAO);
const datasetService = new DatasetService(datasetRepository);

export const getAllDatasets = async (req: Request, res: Response) => {
  const datasets = await datasetService.getAllDatasets();
  res.json(datasets);
};

export const getDatasetById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const dataset = await datasetService.getDatasetById(id);
  if (dataset) {
    res.json(dataset);
  } else {
    res.status(404).json({ message: 'Dataset not found' });
  }
};

export const createDataset = async (req: Request, res: Response) => {
  const dataset = await datasetService.createDataset(req.body);
  res.status(201).json(dataset);
};

export const updateDataset = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const dataset = await datasetService.updateDataset(id, req.body);
  if (dataset) {
    res.json(dataset);
  } else {
    res.status(404).json({ message: 'Dataset not found' });
  }
};

export const deleteDataset = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const success = await datasetService.deleteDataset(id);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Dataset not found' });
  }
};
