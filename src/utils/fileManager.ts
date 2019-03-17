import { UploadedFile } from 'express-fileupload';
import { TMP, EXTERNALSTATIC } from '../config/const';
import * as uuid from 'uuid/v3';
import * as path from 'path';
import * as  fs from 'fs';

export class FileManager {

  public static getExtension(expressFile: UploadedFile){
    const lengthOfDots = expressFile.name.split('.').length; // get last dot.
    return `.${expressFile.name.split('.')[lengthOfDots - 1]}`;
  }

  public static getSize(bytelength: number){
    const bytes = bytelength;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const div = Math.log(bytes) / Math.log(1024);
    const i = parseInt(`${Math.floor(div)}`, 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  }

  public static checkMimetype(expressFile: UploadedFile, type: string){
    return expressFile.mimetype.startsWith(type) ? true : false;
  }

  public static manageFile(
    expressFile: UploadedFile,
    movePath: string,
    newName: string = uuid() + FileManager.getExtension(expressFile)): Promise<string> {

    // tslint:disable-next-line:no-shadowed-variable
    return new Promise(async (resolve, reject) => {

      const completePath: string = path.join(movePath, newName);

      // Move file.
      expressFile.mv(completePath, (errMoving: string) => {
        if (errMoving) {
          fs.readdir(TMP, (errReadingDir, files) => {
            if (!errReadingDir){
              console.log(`Error reading temporal folder: ${errReadingDir.message}`);
            } else {
              for (const file of files){
                fs.unlink(TMP + file, (errDeleting) => {
                  console.log(`Error deleting temporal file: ${errDeleting.message}`);
                });
              }
            }
          });
          return reject(new Error(`Error moving file to public path: ${errMoving}`));
        }

        return resolve(EXTERNALSTATIC + newName);
      });
    });
  }
}