import { Request, Response } from 'express';
import { ContentService } from '../services/contentService';
import ContentRepositoryImpl from '../repositories/implementations/contentRepositoryImpl';
import ContentDAO from '../dao/implementations/contentDAOImpl';
import { CustomRequest } from '../middleware/authMiddleware';
import DatasetDAO from '../dao/implementations/datasetDAOImpl';
import DatasetRepositoryImpl from '../repositories/implementations/datasetRepositoryImpl';
import { DatasetService } from '../services/datasetService';

const contentDAO = new ContentDAO()
const contentRepository = new ContentRepositoryImpl(contentDAO); 
const contentService = new ContentService(contentRepository);

const datasetDAO = new DatasetDAO()
const datasetRepository = new DatasetRepositoryImpl(datasetDAO);
const datasetService = new DatasetService(datasetRepository);

export const getAllContents = async (req: Request, res: Response) => {
  const contents = await contentService.getAllContents();
  res.json(contents);
};

export const getContentById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const content = await contentService.getContentById(id);
  if (content) {
    res.json(content);
  } else {
    res.status(404).json({ message: 'Content not found' });
  }
};

export const createContent = async (req: CustomRequest, res: Response) => {
  const { datasetId, type } = req.body;
  const userId = req.user?.id;

  if (["zip", "mp4", "jpg", "png"].includes(type)) {
    try {
      const dataset = await datasetService.getDatasetById(datasetId);

      if (!dataset) {
        return res.status(404).json({ message: 'Dataset not found' });
      }

      if (dataset.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized access to dataset' });
      }

      const content = await contentService.createContent(req.body);
      return res.status(201).json(content);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(404).json({ message: 'Invalid content type' });
  }
};


export const updateContent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const content = await contentService.updateContent(id, req.body);
  if (content) {
    res.json(content);
  } else {
    res.status(404).json({ message: 'Content not found' });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const success = await contentService.deleteContent(id);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Content not found' });
  }
};
