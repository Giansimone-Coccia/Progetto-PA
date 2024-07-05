import Content, { ContentAttributes, ContentCreationAttributes } from '../models/content';
import IContentRepository from '../repositories/interfaces/iContentRepository';
import AdmZip = require('adm-zip');
import * as ffmpeg from 'fluent-ffmpeg';


export class ContentService {
  private contentRepository: IContentRepository;

  constructor(contentRepository: IContentRepository) {
    this.contentRepository = contentRepository;
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

  static calculateCost(type: string, data: Buffer): number | null {
    switch (type) {
      case 'image':
        return 0.65;
      case 'video':
        return this.countFramesInVideo(data);
      case 'zip':
        return this.countImagesInZip(data);
      default:
        return null;
    }
  }
  
  private static countImagesInZip(data: Buffer): number | null {
    try {
      const zip = new AdmZip(data);
  
      const zipEntries = zip.getEntries();
  
      let imageCount = 0;
      zipEntries.forEach(entry => {
        if (entry.name.match(/\.(jpg|jpeg|png)$/i)) {
          imageCount++;
        }
      });
  
      return imageCount * 0.65;
    } catch (error) {
      console.error('Errore durante il conteggio delle immagini nel file zip:', error);
      return null;
    }
  }

  private static countFramesInVideo(data: Buffer): number{
    return 1
    /*return new Promise((resolve, reject) => {
        // Salva il buffer in un file temporaneo (opzionale, puoi anche utilizzare il buffer direttamente con ffprobe)
        const tempFilePath = '/tmp/tempvideo.mp4'; // Cambia il percorso a seconda del tuo ambiente

        // Scrivi il buffer su un file temporaneo
        fs.writeFile(tempFilePath, data, async (err) => {
            if (err) {
                console.error('Errore durante il salvataggio del buffer su file temporaneo:', err);
                reject(null);
                return;
            }

            // Ottieni le informazioni del video utilizzando ffprobe di ffmpeg
            ffmpeg.ffprobe(tempFilePath, (ffprobeErr, metadata) => {
                if (ffprobeErr) {
                    console.error('Errore durante il probing del video:', ffprobeErr);
                    reject(null);
                    return;
                }

                // Ottieni il numero di frame
                const numFrames = metadata.streams[0].nb_frames;

                // Rimuovi il file temporaneo (opzionale)
                fs.unlink(tempFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Errore durante la rimozione del file temporaneo:', unlinkErr);
                    }
                });

                resolve(numFrames);
            });
        });
    });*/
  }
}
