"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../config/response");
const const_1 = require("../config/const");
const fileManager_1 = require("../utils/fileManager");
const moment = require("moment");
const uuid = require("uuid");
const diskspace = require("diskspace");
const fs = require("fs");
class FileController {
    // Get all Files
    async getFiles() {
        return new Promise((resolve, reject) => {
            fs.readdir(const_1.STATIC, (err, files) => {
                if (!err) {
                    response_1.Response.data = [];
                    files.forEach((file) => {
                        console.log(`/api/v1/static/${file}`);
                        response_1.Response.data.push(`/api/v1/static/${file}`);
                    });
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
        let customerr;
        if (req.files && req.files.music) {
            const expressFile = req.files.music;
            if (expressFile && fileManager_1.FileManager.checkMimetype(expressFile, 'audio/')) {
                const id = uuid();
                await fileManager_1.FileManager.manageFile(expressFile, const_1.STATIC, id + fileManager_1.FileManager.getExtension(expressFile)).then(async (fullPath) => {
                    response_1.Response.data.path = fullPath;
                    response_1.Response.data.uuid = id;
                    response_1.Response.data.extension = fileManager_1.FileManager.getExtension(expressFile);
                    response_1.Response.data.timestamp = moment();
                    await diskspace.check('/', (err, result) => {
                        if (err) {
                            response_1.Response.data.serverstatus = 'error retrieving server info.';
                        }
                        response_1.Response.data.serverstatus = result;
                    });
                })
                    .catch((err) => {
                    console.log(err);
                    response_1.Response.errors.push(err);
                });
            }
            else {
                customerr = 'File is not an audio file.';
                console.log(customerr);
                response_1.Response.errors.push(customerr);
            }
        }
        else {
            customerr = 'No file attached or field name [music] is empty.';
            console.log(customerr);
            response_1.Response.errors.push('No file attached or field name [music] is empty.');
        }
        return response_1.Response.export();
    }
    // Delete File
    async delFile(req) {
        console.log(req.params);
        return new Promise((resolve, reject) => {
            fs.unlink(`${const_1.STATIC}/${req.params.music}`, (err) => {
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
