import { Response as Rp } from '../config/response';
import { STATIC, EXTERNALSTATIC, FILELIMIT } from '../config/const';
import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import { FileManager } from '../utils/fileManager';
import * as moment from 'moment';
import * as uuid from 'uuid';
import * as fs from 'fs';
import * as diskspace from 'diskspace';
import * as os from 'os';
import * as path from 'path';

class FileController {
  // Get all Files
  public async getFiles() {
    return new Promise((resolve, reject) => {
      fs.readdir(STATIC, (err, files) => {
        if (err) {
          reject(new Error(err.message));
        }

        Rp.data = [];
        for (const file of files) {
          console.log(EXTERNALSTATIC + file);
          Rp.data.push(EXTERNALSTATIC + file);
        }
        resolve(Rp.export());

      });
    });
  }

  // Create a new file.
  public async postFile(req: Request) {
    return new Promise(async (resolve, reject) => {

      let customerr: string;
      const OSRoot = (os.platform() === 'win32') ? process.cwd().split(path.sep)[0] : '/';

      await diskspace.check(OSRoot, (err, result) => {
        if (!err) {
          const { total, used, free, status } = result;
          if (free < FILELIMIT) {
            customerr = `Disk full at critical levels, space left: ${FileManager.getSize(free)},
            denying any file upload until free space (${free}) > file limit(${FILELIMIT})`;
            return reject(new Error(customerr));
          }
        }
      });

      if (!req.files || !req.files.music || !(req.files.music as UploadedFile).name) {
        customerr = 'No file attached or field name [music] is empty.';
        return reject(new Error(customerr));
      }

      const expressFile = req.files.music as UploadedFile;
      if (!expressFile || !FileManager.checkMimetype(expressFile, 'audio/')) {
        customerr = 'File is not an audio file.';
        return reject(new Error(customerr));
      }

      const id: string = uuid();
      const newname = id + FileManager.getExtension(expressFile);

      await FileManager.manageFile(
        expressFile,
        STATIC,
        newname,
      )
      .then(async (serverpath) => {
        Rp.data.path = serverpath;
        Rp.data.newname = newname;
        Rp.data.idname = id;
        Rp.data.extension = FileManager.getExtension(expressFile);
        Rp.data.timestamp = moment();
        resolve(Rp.export());
      })
      .catch((err) => {
        return reject(new Error(err.message));
      });
    });
  }

  // Delete File
  public async delFile(req: Request) {
    return new Promise((resolve, reject) => {
      fs.unlink(STATIC + req.params.music, (err) => {
        if (err) {
          reject(new Error(`Error deleting file ${req.params.music}, Reason: ${err.message}`));
        } else {
          Rp.data.status = `Sucess: File ${req.params.music} deleted!`;
          resolve(Rp.export());
        }
      });
    });
  }
}

export const fileController = new FileController();
