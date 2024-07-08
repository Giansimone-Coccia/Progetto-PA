import Content, { ContentAttributes, ContentCreationAttributes } from '../models/content';
import IContentRepository from '../repositories/interfaces/iContentRepository';
import AdmZip = require('adm-zip');
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';


export class ContentService {
  private static instance: ContentService;
  private contentRepository: IContentRepository;

  private constructor(contentRepository: IContentRepository) {
    this.contentRepository = contentRepository;
  }

  static getInstance(contentRepository: IContentRepository): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService(contentRepository);
    }
    return ContentService.instance;
  }

  async getAllContents(): Promise<ContentAttributes[]> {
    return this.contentRepository.findAll();
  }

  async getContentById(id: number): Promise<ContentAttributes | null> {
    return this.contentRepository.findById(id);
  }

  async getContentByDatasetId(datasetId: number): Promise<ContentAttributes[] | null> {
    return this.contentRepository.findContentByDatasetId(datasetId);
  }

  async createContent(content: ContentCreationAttributes): Promise<ContentAttributes> {
    return this.contentRepository.create(content);
  }

  async updateContent(id: number, content: Partial<ContentAttributes>): Promise<boolean> {
    return this.contentRepository.update(id, content);
  }

  async deleteContent(id: number): Promise<boolean> {
    return this.contentRepository.delete(id);
  }

  /*static mimeTypesMapping: Record<string, string[]> = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime'],
    zip: ['application/zip', 'application/x-rar-compressed', 'application/x-tar']
  };*/

  static mimeTypesMapping: Record<string, string[]> = {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    video: ['video/mp4'],
    zip: ['application/zip']
  };

  static checkMimetype(type: string, mimetype: string): boolean {
    const allowedMimeTypes = ContentService.mimeTypesMapping[type];
    return allowedMimeTypes ? allowedMimeTypes.includes(mimetype) : false;
  }

  calculateInferenceCost(contents: ContentAttributes[]): number {
    return contents.reduce((accumulator, currentContent) => {
      if (currentContent.type == 'image') {
        accumulator += (currentContent.cost / 0.65) * 2.75
      }
      else if (currentContent.type == 'zip') {
        accumulator += (currentContent.cost / 0.7) * 2.75
      }
      else {
        accumulator += (currentContent.cost / 0.45) * 2.75
      }
      return accumulator;
    }, 0);
  }

  reduceContents(contents: ContentAttributes[]): (string | Buffer)[][] {
    return contents.map(content => [content.name, content.type, content.data]);
  }

  async calculateCost(type: string, data: Buffer): Promise<number | null> {
    switch (type) {
      case 'image':
        return 0.65;
      case 'video':
        const frames: number = await this.countFramesInVideo(data)
        return frames * 0.45;
      case 'zip':
        return (this.countImagesInZip(data) || 0) * 0.7;
      default:
        return null;
    }
  }

  private countImagesInZip(data: Buffer): number | null {
    try {
      const zip = new AdmZip(data);

      const zipEntries = zip.getEntries();

      let imageCount = 0;
      zipEntries.forEach(entry => {
        if (entry.name.match(/\.(jpg|jpeg|png)$/i)) {
          imageCount++;
        }
      });

      return imageCount;
    } catch (error) {
      console.error('Errore durante il conteggio delle immagini nel file zip:', error);
      return null;
    }
  }


  private async countFramesInVideo(data: Buffer): Promise<number> {
    // Comando per ottenere le informazioni video con ffprobe
    const ffprobeCommand = 'ffprobe';
    const args = [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=nb_frames',
      '-of', 'default=nokey=1:noprint_wrappers=1',
      '-'
    ];

    return new Promise((resolve, reject) => {
      const ffprobeProcess = spawn(ffprobeCommand, args);

      let frameCount = 0;

      // Scrivi il buffer nel processo di ffprobe
      ffprobeProcess.stdin.write(data);
      ffprobeProcess.stdin.end();

      ffprobeProcess.stdout.on('data', (data) => {
        const frames = parseInt(data.toString().trim(), 10);
        if (!isNaN(frames)) {
          frameCount = frames;
        }
      });

      ffprobeProcess.stderr.on('data', (data) => {
        console.error(`Error during frame count: ${data}`);
      });

      ffprobeProcess.on('close', (code) => {
        if (code === 0) {
          resolve(frameCount);
        } else {
          reject(new Error(`ffprobe exited with code ${code}`));
        }
      });

      ffprobeProcess.on('error', (err) => {
        console.error(`Error executing ffprobe: ${err}`);
        reject(err);
      });
    });
  }
}
