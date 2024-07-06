import { Response } from 'express';
import { DatasetService } from '../services/datasetService';

class ErrorHelper {
    private datasetService: DatasetService; 

    constructor(datasetService: DatasetService) {
        this.datasetService = datasetService;
    }


    async validateDatasetAccess(datasetId: number, userId: number, res: Response) {
        const dataset = await this.datasetService.getDatasetById(datasetId);

        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }

        if (dataset.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to dataset' });
        }
    }
}

export default ErrorHelper;
