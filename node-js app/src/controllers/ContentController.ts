import { Request, Response } from 'express';
import { ContentService } from '../services/ContentService';
import ContentRepositoryImpl from '../repositories/Implementations/ContentRepositoryImpl';
import ContentDAO from '../dao/Implementations/ContentDAO';

const contentDAO = new ContentDAO()
const contentRepository = new ContentRepositoryImpl(contentDAO); 
const contentService = new ContentService(contentRepository);

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

export const createContent = async (req: Request, res: Response) => {
  const content = await contentService.createContent(req.body);
  res.status(201).json(content);
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
