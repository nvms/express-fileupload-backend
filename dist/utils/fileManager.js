"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v3");
const path = require("path");
class FileManager {
    static getExtension(expressFile) {
        const lengthOfDots = expressFile.name.split('.').length; // get last dot.
        return `.${expressFile.name.split('.')[lengthOfDots - 1]}`;
    }
    static getSize(expressFile) {
        const bytes = expressFile.data.byteLength;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0)
            return 'n/a';
        const div = Math.log(bytes) / Math.log(1024);
        const i = parseInt(`${Math.floor(div)}`, 10);
        if (i === 0)
            return `${bytes} ${sizes[i]})`;
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    }
    static checkMimetype(expressFile, type) {
        return expressFile.mimetype.startsWith(type) ? true : false;
    }
    static manageFile(expressFile, movePath, newName = uuid() + FileManager.getExtension(expressFile)) {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise((resolve, reject) => {
            const completePath = path.join(movePath, newName);
            // Move file.
            expressFile.mv(completePath, (errMoving) => {
                if (errMoving) {
                    reject(`Error moving file to public path: ${errMoving}`);
                }
                resolve(`/api/v1/static/${newName}`);
            });
        });
    }
}
exports.FileManager = FileManager;
