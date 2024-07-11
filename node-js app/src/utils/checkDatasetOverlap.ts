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
    // Check for duplicate content if name or userId has been changed
    if (!datasetName && !userId) {
        return true; // No need to check if neither name nor userId has changed
    }

    // Fetch datasets with the same name and user ID
    const datasetsWithSameName = await datasetService.getDatasetWithSameName(datasetName, userId);

    // Iterate through datasets to check for overlap
    for (const dataset of datasetsWithSameName) {
        if (dataset.id === datasetId) {
            continue; // Skip the dataset being edited
        }

        let currentContents: ContentAttributes[] = [];
        let currentContentHashes: Set<string> = new Set<string>();

        // If datasetId is provided, fetch current contents and include new content
        if (datasetId !== null) {
            currentContents = await contentService.getContentByDatasetId(datasetId) || [];
            currentContents = currentContents.concat(newContent);
            currentContentHashes = new Set(currentContents.map(content => datasetService.createContentHash(content)));
        }

        // Fetch existing contents of the current dataset
        const existingContents = await contentService.getContentByDatasetId(dataset.id) || [];
        let existingContentHashes: Set<string> = new Set<string>();

        // If existing contents exist, create content hashes
        if (existingContents.length !== 0) {
            existingContentHashes = new Set(existingContents.map(content => datasetService.createContentHash(content)));
        }

        // If both datasets have no contents, they overlap
        if (existingContents.length === 0 && currentContents.length === 0) {
            return true;
        }

        // Check for intersection of content hashes
        const intersection = [...existingContentHashes].filter(hash => currentContentHashes.has(hash));

        if (intersection.length > 0) {
            return true; // Found overlapping content
        }
    }

    return false; // No overlapping content found
}
