import { ContentAttributes } from "../models/content";
import { ContentService } from "../services/contentService";
import { DatasetService } from "../services/datasetService";

export async function checkDatasetOverlap(datasetName: string, userId: number, datasetService: DatasetService, contentService: ContentService, datasetId: number | null = null, newContent: ContentAttributes[] = []): Promise<boolean> {
    // Check for duplicate content if name or userId has been changed
    if (!datasetName && !userId) {
        return true; // No need to check if neither name nor userId has changed
    }

    const datasetsWithSameName = await datasetService.getDatasetWithSameName(datasetName, userId);

    for (const dataset of datasetsWithSameName) {
        if (dataset.id === datasetId) {
            continue; // Skip the dataset being edited
        }

        let currentContents: ContentAttributes[] = [];
        let currentContentHashes: Set<string> = new Set<string>();

        if (datasetId !== null) {
            currentContents = await contentService.getContentByDatasetId(datasetId) || [];
            currentContents = currentContents.concat(newContent);
            currentContentHashes = (new Set(currentContents.map(content => datasetService.createContentHash(content))));
        }

        const existingContents = await contentService.getContentByDatasetId(dataset.id) || [];

        let existingContentHashes: Set<string> = new Set<string>();

        if (existingContents.length !== 0) {
            existingContentHashes = (new Set(existingContents.map(content => datasetService.createContentHash(content))));
        }

        if(existingContents.length === 0 && currentContents.length===0 ){
            return true
        }

        // Check for intersection of content hashes
        const intersection = [...existingContentHashes].filter(hash => currentContentHashes.has(hash));

        if (intersection.length > 0) {
            return true; // Found overlapping content
        }
    }

    return false; // No overlapping content found
}
