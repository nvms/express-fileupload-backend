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

    fs.readdir(STATIC, (err, files) => {
      files.forEach((file) => {
        console.log(file);

        if (file !== '.' && file !== '..')
          Rp.data.push(file);
      });
    });

    return Rp.export();
  }

  // Create a new file.
  public async postFile(req: Request) {
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

    return Rp.export();
  }

  // Delete File
  public async delFile(req: Request) {

    fs.unlink(`${STATIC}/${req.params.id}`, (err) => {
      if (err) {
        console.log(err);
        Rp.errors.push(`Error deleting file ${req.params.id}, reason: ${err}`);
      } else {
        Rp.data.status = 'Sucess: File deleted';
      }
    });

    return Rp.export();
  }
}

export const fileController = new FileController();
