import { Response } from 'express';
import { DatasetService } from '../services/datasetService';

class ErrorHelper {
    private datasetService: DatasetService; 

    constructor(datasetService: DatasetService) {
        this.datasetService = datasetService;
    }

    /**
     * Validates if the user has access to the specified dataset.
     * @param datasetId The ID of the dataset to validate access for.
     * @param userId The ID of the user requesting access.
     * @param res The Express Response object to send HTTP responses.
     * @returns Promise<void> Resolves if access is valid, otherwise sends appropriate error response.
     */
    async validateDatasetAccess(datasetId: number, userId: number, res: Response) {
        // Retrieve dataset details from the DatasetService based on datasetId
        const dataset = await this.datasetService.getDatasetById(datasetId);

        // If dataset is not found, send a 404 Not Found response
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }

        // Check if the requesting user's ID matches the dataset's owner's ID
        if (dataset.userId !== userId) {
            // If the user does not own the dataset, send a 403 Forbidden response
            return res.status(403).json({ message: 'Unauthorized access to dataset' });
        }
    }
}

export default ErrorHelper;
