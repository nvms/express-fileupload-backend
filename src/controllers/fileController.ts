import { Response as Rp } from '../config/response';
import { STATIC } from '../config/const';
import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import { FileManager } from '../utils/fileManager';
import * as moment from 'moment';
import * as uuid from 'uuid';
import * as diskspace from 'diskspace';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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
    return new Promise((resolve, reject) => {
      let customerr: string;

      if (!req.files || !req.files.music || !(req.files.music as UploadedFile).name) {
        customerr = 'File is not an audio file.';
        console.log(customerr);
        Rp.errors.push(customerr);
        return reject(Rp);
      }

      const expressFile = req.files.music as UploadedFile;

      if (!expressFile || !FileManager.checkMimetype(expressFile, 'audio/')) {
        customerr = 'No file attached or field name [music] is empty.';
        console.log(customerr);
        Rp.errors.push('No file attached or field name [music] is empty.');
        return reject(Rp);
      }

      const id: string = uuid();

      FileManager.manageFile(
        expressFile,
        STATIC,
        id + FileManager.getExtension(expressFile),
      )
        .then(async (serverpath) => {
          Rp.data.path = serverpath;
          Rp.data.newname = id;
          Rp.data.extension = FileManager.getExtension(expressFile);
          Rp.data.timestamp = moment();
          resolve(Rp.export());

         /*  diskspace.check((os.platform() === 'win32') ? process.cwd().split(path.sep)[0] : '/', (err, result) => {
            if (err) {
              Rp.data.serverstatus = 'error retrieving server info.';
              resolve(Rp.export());
            }
            Rp.data.serverstatus = result;
            resolve(Rp.export());
          }); */

        })
        .catch((err) => {
          console.log(err);
          Rp.errors.push(err);
        });
    });
  }

  // Delete File
  public async delFile(req: Request) {
    console.log(req.params);

    return new Promise((resolve, reject) => {
      fs.unlink(`${STATIC}/${req.params.music}`, (err) => {
        if (err) {
          console.log(err);
          Rp.errors.push(
            `Error deleting file ${req.params.music}, reason: ${err}`,
          );
          reject(Rp);
        } else {
          Rp.data.status = `Sucess: File ${req.params.music} deleted!`;
          resolve(Rp.export());
        }
      });
    });
  }
}

export const fileController = new FileController();
