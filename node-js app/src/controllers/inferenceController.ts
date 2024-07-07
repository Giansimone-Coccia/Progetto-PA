import { Request, Response } from 'express';
import { InferenceService } from '../services/inferenceService';
import InferenceRepositoryImpl from '../repositories/implementations/inferenceRepositoryImpl';
import InferenceDAO from '../dao/implementations/inferenceDAOImpl';
import axios from 'axios';
import ContentDAO from '../dao/implementations/contentDAOImpl';
import { ContentService } from '../services/contentService';
import ContentRepositoryImpl from '../repositories/implementations/contentRepositoryImpl';
import { CustomRequest } from '../middleware/authMiddleware';
import { DatasetService } from '../services/datasetService';
import DatasetDAO from '../dao/implementations/datasetDAOImpl';
import DatasetRepositoryImpl from '../repositories/implementations/datasetRepositoryImpl';
import UserDAO from '../dao/implementations/userDAOImpl';
import { UserService } from '../services/userService';
import UserRepositoryImpl from '../repositories/implementations/userRepositoryImpl';

interface ProcessInfo {
  status: string;
  result: JSON | null;
}

class InferenceController {
  private static instance: InferenceController;
  private inferenceService: InferenceService;
  private processes: { [key: string]: ProcessInfo } = {};
  private contentService: ContentService;
  private datasetService: DatasetService;
  private userService: UserService;

  private constructor() {
    const inferenceDAO = new InferenceDAO();
    const inferenceRepository = new InferenceRepositoryImpl(inferenceDAO);
    this.inferenceService = new InferenceService(inferenceRepository);

    const contentDAO = new ContentDAO();
    const contentRepository = new ContentRepositoryImpl(contentDAO);
    this.contentService = new ContentService(contentRepository);

    const datasetDAO = new DatasetDAO();
    const datasetRepository = new DatasetRepositoryImpl(datasetDAO);
    this.datasetService = new DatasetService(datasetRepository);

    const userDAO = new UserDAO();
    const userRepository = new UserRepositoryImpl(userDAO);
    this.userService = new UserService(userRepository);
  }

  public static getInstance(): InferenceController {
    if (!InferenceController.instance) {
      InferenceController.instance = new InferenceController();
    }
    return InferenceController.instance;
  }

  public getAllInferences = async (req: Request, res: Response) => {
    const inferences = await this.inferenceService.getAllInferences();
    res.json(inferences);
  };

  public getInferenceById = async (req: Request, res: Response) => {
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

  public createInference = async (req: Request, res: Response) => {
    const inference = await this.inferenceService.createInference(req.body);
    res.status(201).json(inference);
  };

  public updateInference = async (req: Request, res: Response) => {
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
    } catch (error) {
      console.error(`Error updating inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteInference = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID. ID must be a number' });
    }

    try {
      const success = await this.inferenceService.deleteInference(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Inference not found' });
      }
    } catch (error) {
      console.error(`Error updating inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  startInference = async (req: CustomRequest, res: Response) => {
    const { datasetId, modelId } = req.body;
    const userId = req.user?.id;

    try {

      if (!userId) {
        return res.status(401).send('Unauthorized');
      }

      if (!datasetId) {
        return res.status(400).send('datasetId è richiesto');
      }

      if (!datasetId || !modelId) {
        return res.status(400).send('datasetId e modelId sono richiesti');
      }

      const dataset = await this.datasetService.getDatasetById(datasetId);

      if (!dataset) {
        return res.status(404).send('Dataset not found' );
      }

      if (dataset.userId !== userId) {
        return res.status(403).send('Unauthorized access to dataset');
      }

      const processId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      this.processes[processId] = { status: 'running', result: null };

      const contents = await this.contentService.getContentByDatasetId(datasetId);

      if (contents == null || contents === undefined) {
        return res.status(404).send('Il servizio getContentByDatasetId ha restituito un valore null o undefined.');
      }

      const cost = ContentService.calculateContentsCost(contents);

      //console.log(cost)

      const user = await this.userService.getUserById(userId);

      if(!user){
        this.processes[processId] = { status: 'failed', result: null };
        return res.status(401).send('Unauthorized');
      }

      if (cost > user.tokens) {
        this.processes[processId] = { status: 'aborted', result: null };
        return res.status(400).send(`Not enough tokens`);
      }

      const jsonContents = ContentService.reduceContents(contents);

      try {
        const response = await axios.post(`http://inference:5000/predict`, { jsonContents, modelId });

        if (response.data && response.data.hasOwnProperty('error') && response.data.hasOwnProperty('error_code')) {
          return res.status(response.data.error_code).send(response.data.error);
        }
        
        const status = 'completed';

        let tokens = user.tokens - cost

        await this.userService.updateUser(userId, { tokens });

        //console.log({...req.body, cost, status, response  });

        const inference = await this.inferenceService.createInference({...req.body, cost, status, result: response.data, model: modelId });

        this.processes[processId].status = 'completed';
        this.processes[processId].result = response.data;
        console.log("inference", inference);
        res.json(inference);
      } catch (error) {
        console.error(`Errore durante la chiamata al servizio di inferenza: ${error}`);
        this.processes[processId].status = 'error';
        // this.processes[processId].result = error.message;
        res.status(500).send('Errore nella comunicazione con Axios');
      }
    } catch (error) {
      console.error(`Errore durante l'esecuzione dell'inferenza: ${error}`);
      //this.processes[processId].status = 'error';
      // this.processes[processId].result = error.message;
      res.status(500).send('Errore durante l esecuzione dell inferenza');
    }
  };

  public getStatus = async (req: CustomRequest, res: Response) => {
    const processId = req.body.processId;

    try {
      console.log(processId);
      if (!processId) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      // Ottieni l'inferenza dal servizio
      const inference = await this.inferenceService.getInferenceById(processId);
      console.log(inference);
      // Verifica se l'inferenza esiste
      if (!inference) {
        return res.status(404).json({ message: 'Inference not found' });
      }

      // Ritorna l'inferenza trovata
      res.json({
        status: inference.status,
        result: inference.result,
      });
    } catch (error) {
      console.error(`Error fetching inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

}

export default InferenceController;
