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

  startInference = async (req: Request, res: Response) => {
    const { datasetId, modelId } = req.body;
  
    // Verifica che datasetId e modelId siano presenti
    if (!datasetId || !modelId) {
      return res.status(400).send('datasetId e modelId sono richiesti');
    }
  
    // Genera un ID unico per il processo
    const processId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    this.processes[processId] = { status: 'running', result: null };
  
    try {
      // Recupera i contenuti dalla tabella Contents usando datasetId
      const contents = await this.contentService.getContentByDatasetId(datasetId);
  
      // Verifica se contents è null o undefined
      if (contents === null || contents === undefined) {
        throw new Error('Il servizio getContentByDatasetId ha restituito un valore null o undefined.');
      }
  
      // Trasforma la lista dei contenuti in una stringa JSON
      const jsonContents = contents.map(content => [content.type, content.data]);
  
      try {
        // Chiamata HTTP all'endpoint di inferenza
        const response = await axios.post(`http://inference:5000/predict`, { jsonContents, modelId });
  
        // Aggiorna lo stato del processo e il risultato
        this.processes[processId].status = 'completed';
        this.processes[processId].result = response.data;
        res.json(response.data);
      } catch (error) {
        console.error(`Errore durante la chiamata al servizio di inferenza: ${error}`);
        this.processes[processId].status = 'error';
        //this.processes[processId].result = error.message;
        res.status(500).send('Errore nella comunicazione con Axios: ' + error);
      }
    } catch (error) {
      console.error(`Errore durante l'esecuzione dell'inferenza: ${error}`);
      this.processes[processId].status = 'error';
      //this.processes[processId].result = error.message;
      res.status(500).send('Errore durante l esecuzione dell inferenza');
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
