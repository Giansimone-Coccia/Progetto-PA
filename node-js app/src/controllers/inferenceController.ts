import { Request, Response } from 'express';
import { InferenceService } from '../services/inferenceService';
import { CustomRequest } from '../middleware/authMiddleware';
import inferenceQueue from '../queue/inferenceQueue';

interface ProcessInfo {
  status: string;
  result: JSON | null;
}

class InferenceController {
  private static instance: InferenceController;
  private inferenceService: InferenceService;

  private constructor() {
    this.inferenceService = InferenceService.getInstance();
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

  public startInference = async (req: CustomRequest, res: Response) => {
    const { datasetId, modelId } = req.body;
    const userId = req.user?.id;

    try {

      const job = await inferenceQueue.add({ datasetId, modelId, userId });
      const jobId = job.id;

      return res.json({ "id processamento": jobId })

    } catch (error) {
      console.error(`Errore durante l'esecuzione dell'inferenza: ${error}`);
      res.status(500).send("Errore durante l'esecuzione dell'inferenza");
    }
  };

  public getStatus = async (req: CustomRequest, res: Response) => {
    const jobId = req.params.jobId;

    try {
      const job = await inferenceQueue.getJob(jobId);
      if (job) {
        const progress = job.progress();
        const result = job.returnvalue;

        if (progress["state"] == "completed") {
          return res.json({
            jobId: job.id,
            state: progress["state"],
            message: progress["message"],
            result
          });
        }
        else {
          return res.status(progress["error_code"]).json({
            jobId: job.id,
            state: progress["state"],
            message: progress["message"],
          });
        }
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving job status', error });
    }
  }
}



export default InferenceController;
