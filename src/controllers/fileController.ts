import { Response as Rp } from '../config/response';
import { STATIC } from '../config/const';
import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import { FileManager } from '../utils/fileManager';
import * as moment from 'moment';
import * as uuid from 'uuid/v3';
import * as diskspace from 'diskspace';
import * as fs from 'fs';

class FileController {

  // Get all Files
  public async getFiles() {
    return new Promise((resolve, reject) => {
      fs.readdir(STATIC, (err, files) => {
        if (!err) {
          Rp.data = [];

          files.forEach((file) => {
            console.log(`/api/v1/static/${file}`);
            Rp.data.push(`/api/v1/static/${file}`);
          });
          resolve(Rp.export());
        } else {
          console.log(err.message);
          Rp.errors.push(err.message);
          reject(Rp);
        }
      });
    });
  }

  // Create a new file.
  public async postFile(req: Request) {
    if (req.files && req.files.music) {

      const expressFile = (req.files.music as UploadedFile);

      if (expressFile && FileManager.checkMimetype(expressFile, 'audio/')) {

        const id: string = uuid();

        await FileManager.manageFile(expressFile, STATIC, id + FileManager.getExtension(expressFile)).then(async (fullPath) => {
          Rp.data.path = fullPath;
          Rp.data.uuid = id;
          Rp.data.extension = FileManager.getExtension(expressFile);
          Rp.data.size = FileManager.getSize(expressFile);
          Rp.data.timestamp = moment();
          diskspace.check('/', (err, result) => {
            if (err) {
              Rp.data.serverstatus = 'error retrieving server info.';
            }
            Rp.data.serverstatus = result;
          });
        })
        .catch((err) => {
          console.log(err);
          Rp.errors.push(err);
        });
      } else {
        Rp.errors.push('File is not an audio file.');
      }
    } else {
      Rp.errors.push('No file attached or field name [music] is empty.');
    }
    return Rp.export();
  }

  // Delete File
  public async delFile(req: Request) {
    return new Promise((resolve, reject) => {
      fs.unlink(`${STATIC}/${req.params.id}`, (err) => {
        if (err) {
          console.log(err);
          Rp.errors.push(`Error deleting file ${req.params.id}, reason: ${err}`);
          reject(Rp);
        } else {
          Rp.data.status = `Sucess: File ${req.params.id} deleted!`;
          resolve(Rp.export());
        }
      });
    });
  }
}

export const fileController = new FileController();
