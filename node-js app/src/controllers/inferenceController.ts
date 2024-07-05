import { Request, Response } from 'express';
import { InferenceService } from '../services/inferenceService';
import InferenceRepositoryImpl from '../repositories/implementations/inferenceRepositoryImpl';
import InferenceDAO from '../dao/implementations/inferenceDAOImpl';
import axios from 'axios';
import ContentDAO from '../dao/implementations/contentDAOImpl';
import { ContentService } from '../services/contentService';
import ContentRepositoryImpl from '../repositories/implementations/contentRepositoryImpl';

interface ProcessInfo {
  status: string;
  result: JSON | null;
}

class InferenceController {
  private inferenceService: InferenceService;
  private processes: { [key: string]: ProcessInfo } = {};
  private contentService: ContentService;

  constructor() {
    const inferenceDAO = new InferenceDAO();
    const inferenceRepository = new InferenceRepositoryImpl(inferenceDAO);
    this.inferenceService = new InferenceService(inferenceRepository);
    const contentDAO = new ContentDAO();
    const contentRepository = new ContentRepositoryImpl(contentDAO);
    this.contentService = new ContentService(contentRepository);
  }

  getAllInferences = async (req: Request, res: Response) => {
    const inferences = await this.inferenceService.getAllInferences();
    res.json(inferences);
  };

  getInferenceById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const inference = await this.inferenceService.getInferenceById(id);
    try {
      // Controlla se l'id è un numero valido
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID. ID must be a number' });
      }

      // Ottieni l'inferenza dal servizio
      const inference = await this.inferenceService.getInferenceById(id);

      // Verifica se l'inferenza esiste
      if (!inference) {
        return res.status(404).json({ message: 'Inference not found' });
      }

      // Ritorna l'inferenza trovata
      res.json(inference);
    } catch (error) {
      console.error(`Error fetching inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createInference = async (req: Request, res: Response) => {
    const inference = await this.inferenceService.createInference(req.body);
    res.status(201).json(inference);
  };

  updateInference = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID. ID must be a number' });
    }

    try {
      const inference = await this.inferenceService.updateInference(id, req.body);
      if (inference) {
        res.json(inference);
      } else {
        res.status(404).json({ message: 'Inference not found' });
      }
    }catch (error) {
      console.error(`Error updating inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteInference = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID. ID must be a number' });
    }
    
    try{
      const success = await this.inferenceService.deleteInference(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Inference not found' });
      }
    }catch (error) {
      console.error(`Error updating inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  startInference = async (req: Request, res: Response) => {
    const { datasetId, modelId } = req.body;

    if (!datasetId || !modelId) {
      return res.status(400).send('datasetId e modelId sono richiesti');
    }

    // Genera un ID unico per il processo
    const processId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    this.processes[processId] = { status: 'running', result: null };

    try {
      // Recupera i contenuti dalla tabella Contents usando datasetId
      const contents = await this.contentService.getContentByDatasetId(datasetId);

      // Trasforma la lista dei contenuti in una stringa JSON
      const jsonContents = JSON.stringify(contents);

      try {
        const response = await axios.post(`http://inference:5000/predict`, { jsonContents, modelId });
        this.processes[processId].status = 'completed';
        this.processes[processId].result = response.data;
        res.json({ processId: processId, result: response.data });
      } catch (error) {
        console.error(`Error calling inference service: ${error}`);
        this.processes[processId].status = 'error';
        //this.processes[processId].result = error.message;
        res.status(500).send('Error performing inference');
      }
    } catch (error) {
      console.error(`Error performing inference: ${error}`);
      this.processes[processId].status = 'error';
      //this.processes[processId].result = error.message;
      res.status(500).send('Error performing inference');
    }
  };

  getStatus = (req: Request, res: Response) => {
    const processId = req.params.processId;
    const processInfo = this.processes[processId];

    if (!processInfo) {
      return res.status(404).json({ message: 'Process not found' });
    }

    res.json({
      status: processInfo.status,
      result: processInfo.result,
    });
  };
}

export default InferenceController;
