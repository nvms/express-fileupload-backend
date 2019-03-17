import { UploadedFile } from 'express-fileupload';
import * as uuid from 'uuid/v3';
import * as path from 'path';

export class FileManager {

  public static getExtension(expressFile: UploadedFile){
    const lengthOfDots = expressFile.name.split('.').length; // get last dot.
    return `.${expressFile.name.split('.')[lengthOfDots - 1]}`;
  }

  public static getSize(expressFile: UploadedFile){
    const bytes = expressFile.data.byteLength;
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
    return new Promise((resolve, reject) => {
      const completePath: string = path.join(movePath, newName);

        // Move file.
      expressFile.mv(completePath, (errMoving: string) => {
        if (errMoving) {
          reject(`Error moving file to public path: ${errMoving}`);
        }

        resolve(`/api/v1/static/${newName}`);
      });
    });
  }
}