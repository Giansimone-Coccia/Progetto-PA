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

export const getDatasetById = async (req: CustomRequest, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  try {
    const dataset = await datasetService.getDatasetById(id);

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    else if (dataset.userId !== userId){
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(dataset);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const createDataset = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  const datasetData = { ...req.body, userId };

  try {
    const dataset = await datasetService.createDataset(datasetData);
    res.status(201).json(dataset);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateDataset = async (req: CustomRequest, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  try {
    let dataset = await datasetService.getDatasetById(id);

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    else if (dataset.userId !== userId){
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let datasetUpdated = await datasetService.updateDataset(id, req.body);

    if (datasetUpdated) {
      res.json("Dataset updated");
    } else {
      res.status(400).json({ message: 'Failed to update dataset' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  };
}


export const deleteDataset = async (req: CustomRequest, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  try {
    let dataset = await datasetService.getDatasetById(id);

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    else if (dataset.userId !== userId){
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const success = await datasetService.deleteDataset(id);

    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Dataset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
