import { ContentAttributes } from "../models/content";
import { ContentService } from "../services/contentService";
import { DatasetService } from "../services/datasetService";

/**
 * Checks if there is any overlap of content between datasets with the same name and user ID.
 * @param datasetName - The name of the dataset to check for overlap.
 * @param userId - The ID of the user who owns the dataset.
 * @param datasetService - Instance of DatasetService to interact with datasets.
 * @param contentService - Instance of ContentService to interact with contents.
 * @param datasetId - Optional ID of the dataset being edited (to exclude from overlap check).
 * @param newContent - Optional array of new content attributes to include in the overlap check.
 * @returns A Promise that resolves to true if there is an overlap, false otherwise.
 */
export async function checkDatasetOverlap(
    datasetName: string,
    userId: number,
    datasetService: DatasetService,
    contentService: ContentService,
    datasetId: number | null = null,
    newContent: ContentAttributes[] = []
): Promise<boolean> {
    // Return true if neither datasetName nor userId has been provided
    if (!datasetName && !userId) {
        return true;
    }

    // Fetch datasets with the same name and user ID
    const datasetsWithSameName = await datasetService.getDatasetWithSameName(datasetName, userId);

    // Iterate through datasets to check for overlap
    for (const dataset of datasetsWithSameName) {
        if (dataset.id === datasetId) {
            continue; // Skip the dataset being edited
        }

        // Fetch current contents and include new content if datasetId is provided
        const currentContents = datasetId !== null 
            ? [...(await contentService.getContentByDatasetId(datasetId) || []), ...newContent] 
            : [];

        const currentContentHashes = new Set(currentContents.map(content => datasetService.createContentHash(content)));

        // Fetch existing contents of the current dataset
        const existingContents = await contentService.getContentByDatasetId(dataset.id) || [];
        const existingContentHashes = new Set(existingContents.map(content => datasetService.createContentHash(content)));

        // If both datasets have no contents, they overlap
        if (existingContents.length === 0 && currentContents.length === 0) {
            return true;
        }

        // Check for intersection of content hashes
        if ([...existingContentHashes].some(hash => currentContentHashes.has(hash))) {
            return true; // Found overlapping content
        }
    }

    return false; // No overlapping content found
}
