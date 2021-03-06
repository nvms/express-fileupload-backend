"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../config/response");
const const_1 = require("../config/const");
const fileManager_1 = require("../utils/fileManager");
const moment = require("moment");
const uuid = require("uuid");
const fs = require("fs");
const diskspace = require("diskspace");
const os = require("os");
const path = require("path");
class FileController {
    // Get all Files
    async getFiles() {
        return new Promise((resolve, reject) => {
            fs.readdir(const_1.STATIC, (err, files) => {
                if (err) {
                    return reject(new Error(err.message));
                }
                response_1.Response.data = [];
                for (const file of files) {
                    console.log(const_1.EXTERNALSTATIC + file);
                    response_1.Response.data.push(const_1.EXTERNALSTATIC + file);
                }
                return resolve(response_1.Response.export());
            });
        });
    }
    // Create a new file.
    async postFile(req) {
        return new Promise(async (resolve, reject) => {
            const OSRoot = (os.platform() === 'win32') ? process.cwd().split(path.sep)[0] : '/';
            await diskspace.check(OSRoot, (err, result) => {
                if (!err) {
                    const { total, used, free, status } = result;
                    if (free < const_1.FILELIMIT) {
                        return reject(new Error(`Disk full at critical levels, space left: ${fileManager_1.FileManager.getSize(free)},
            denying any file upload until free space (${free}) > file limit(${const_1.FILELIMIT})`));
                    }
                }
            });
            if (!req.files || !req.files.music || !req.files.music.name) {
                return reject(new Error('No file attached or field name [music] is empty.'));
            }
            const expressFile = req.files.music;
            if (expressFile.truncated) {
                return reject(new Error('File is too heavy.'));
            }
            if (!expressFile || !fileManager_1.FileManager.checkMimetype(expressFile, 'audio/')) {
                return reject(new Error('File is not an audio file.'));
            }
            const id = uuid();
            const newname = id + fileManager_1.FileManager.getExtension(expressFile);
            await fileManager_1.FileManager.manageFile(expressFile, const_1.STATIC, newname)
                .then(async (serverpath) => {
                response_1.Response.data.path = serverpath;
                response_1.Response.data.newname = newname;
                response_1.Response.data.idname = id;
                response_1.Response.data.extension = fileManager_1.FileManager.getExtension(expressFile);
                response_1.Response.data.mimetype = expressFile.mimetype;
                response_1.Response.data.timestamp = moment();
                return resolve(response_1.Response.export());
            })
                .catch((err) => {
                return reject(new Error(err.message));
            });
        });
    }
    // Delete File
    async delFile(req) {
        return new Promise((resolve, reject) => {
            fs.unlink(const_1.STATIC + req.params.music, (err) => {
                if (err) {
                    return reject(new Error(`Error deleting file ${req.params.music}, Reason: ${err.message}`));
                }
                response_1.Response.data.status = `Sucess: File ${req.params.music} deleted!`;
                return resolve(response_1.Response.export());
            });
        });
    }
}
exports.fileController = new FileController();
