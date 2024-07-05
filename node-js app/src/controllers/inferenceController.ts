import { Request, Response } from 'express';
import { InferenceService } from '../services/inferenceService';
import InferenceRepositoryImpl from '../repositories/implementations/inferenceRepositoryImpl';
import InferenceDAO from '../dao/implementations/inferenceDAOImpl';
import { exec } from 'child_process';
import path from 'path';
import axios from 'axios';

interface ProcessInfo {
  status: string;
  result: string | null;
}

class InferenceController {
  private inferenceService: InferenceService;
  private processes: { [key: string]: ProcessInfo } = {};

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

  startInference = async (req: Request, res: Response) => {
    /* const { datasetId, modelId } = req.body;

    if (!datasetId || !modelId) {
      return res.status(400).send('datasetId e modelId sono richiesti');
    }

    // Genera un ID unico per il processo
    const processId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    this.processes[processId] = { status: 'running', result: null }; */

    // Percorso del file Python da eseguire
    /* const scriptPath = path.join(__dirname, '../../../python-inference/src/inference.py');
    console.log(scriptPath);

    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        return;
      }
      console.log(`Python script output: ${stdout}`);
    }); */
    const { image_path } = req.body;
    if (!image_path) {
      return res.status(400).send('Image path is required');
    }

    try {
      const response = await axios.post(`http://inference:5000/predict`, { image_path });
      res.json(response.data);
    } catch (error) {
      console.error(`Error calling inference service: ${error}`);
      res.status(500).send('Error performing inference');
    }

    // Esegui il file Python passando gli ID del dataset e del modello come argomenti
    /* exec(`python ${scriptPath} ${datasetId} ${modelId}`, (error, stdout, stderr) => {
      if (error) {
        this.processes[processId].status = 'error';
        this.processes[processId].result = stderr;
      } else {
        this.processes[processId].status = 'completed';
        this.processes[processId].result = stdout;
      }
    });

    res.json({ processId: processId }); */
    //res.json({ processId: processId });
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
