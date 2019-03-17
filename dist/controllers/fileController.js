"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../config/response");
const const_1 = require("../config/const");
const fileManager_1 = require("../utils/fileManager");
const moment = require("moment");
const uuid = require("uuid");
const fs = require("fs");
class FileController {
    // Get all Files
    async getFiles() {
        return new Promise((resolve, reject) => {
            fs.readdir(const_1.STATIC, (err, files) => {
                if (!err) {
                    response_1.Response.data = [];
                    for (const file of files) {
                        console.log(const_1.EXTERNALSTATIC + file);
                        response_1.Response.data.push(const_1.EXTERNALSTATIC + file);
                    }
                    resolve(response_1.Response.export());
                }
                else {
                    console.log(err.message);
                    response_1.Response.errors.push(err.message);
                    reject(response_1.Response);
                }
            });
        });
    }
    // Create a new file.
    async postFile(req) {
        return new Promise((resolve, reject) => {
            let customerr;
            if (!req.files || !req.files.music || !req.files.music.name) {
                customerr = 'No file attached or field name [music] is empty.';
                console.log(customerr);
                response_1.Response.errors.push('No file attached or field name [music] is empty.');
                return reject(response_1.Response);
            }
            const expressFile = req.files.music;
            if (!expressFile || !fileManager_1.FileManager.checkMimetype(expressFile, 'audio/')) {
                customerr = 'File is not an audio file.';
                console.log(customerr);
                response_1.Response.errors.push(customerr);
                return reject(response_1.Response);
            }
            const id = uuid();
            const newname = id + fileManager_1.FileManager.getExtension(expressFile);
            fileManager_1.FileManager.manageFile(expressFile, const_1.STATIC, newname)
                .then(async (serverpath) => {
                response_1.Response.data.path = serverpath;
                response_1.Response.data.newname = newname;
                response_1.Response.data.idname = id;
                response_1.Response.data.extension = fileManager_1.FileManager.getExtension(expressFile);
                response_1.Response.data.size = fileManager_1.FileManager.getSize(expressFile);
                response_1.Response.data.timestamp = moment();
                resolve(response_1.Response.export());
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
                response_1.Response.errors.push(err);
            });
        });
    }
    // Delete File
    async delFile(req) {
        console.log(req.params);
        return new Promise((resolve, reject) => {
            fs.unlink(const_1.STATIC + req.params.music, (err) => {
                if (err) {
                    console.log(err);
                    response_1.Response.errors.push(`Error deleting file ${req.params.music}, reason: ${err}`);
                    reject(response_1.Response);
                }
                else {
                    response_1.Response.data.status = `Sucess: File ${req.params.music} deleted!`;
                    resolve(response_1.Response.export());
                }
            });
        });
    }
}
exports.fileController = new FileController();
