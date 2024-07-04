import { Request, Response } from 'express';
import { DatasetService } from '../services/DatasetService';
import DatasetRepositoryImpl from '../repositories/Implementations/DatasetRepositoryImpl';
import DatasetDAO from '../dao/Implementations/DatasetDAOImpl';
import { CustomRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/UserService';
import UserDAO from '../dao/Implementations/UserDAOImpl';
import UserRepositoryImpl from '../repositories/Implementations/UserRepositoryImpl';

const datasetDAO = new DatasetDAO()
const datasetRepository = new DatasetRepositoryImpl(datasetDAO);
const datasetService = new DatasetService(datasetRepository);

const userDAO = new UserDAO()
const userRepository = new UserRepositoryImpl(userDAO);
const userService = new UserService(userRepository);

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

export const updateDataset = async (req: CustomRequest, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  try {
    let dataset = await datasetService.getDatasetById(id);

    if (!dataset || dataset.userId !== userId) {
      return res.status(404).json({ message: 'Dataset not found or unauthorized' });
    }

    let datasetUpdated = await datasetService.updateDataset(id, req.body);

    if (datasetUpdated) {
      res.json("Dataset updated");
    } else {
      res.status(404).json({ message: 'Failed to update dataset' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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
