"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../config/response");
const fileManager_1 = require("../utils/fileManager");
const const_1 = require("../config/const");
const diskspace = require("diskspace");
const path = require("path");
const os = require("os");
class StatusController {
    // Get all Files
    async getStatus() {
        return new Promise((resolve, reject) => {
            const OSRoot = (os.platform() === 'win32') ? process.cwd().split(path.sep)[0] : '/';
            diskspace.check(OSRoot, (err, result) => {
                if (err) {
                    console.log(err);
                    response_1.Response.errors.push('error retrieving server info.');
                    reject(new Error(err));
                }
                const { total, used, free, status } = result;
                response_1.Response.data.diskstatus = {};
                response_1.Response.data.diskstatus.disk = OSRoot;
                response_1.Response.data.diskstatus.total = fileManager_1.FileManager.getSize(+total);
                response_1.Response.data.diskstatus.used = fileManager_1.FileManager.getSize(+used);
                response_1.Response.data.diskstatus.free = fileManager_1.FileManager.getSize(+free);
                response_1.Response.data.diskstatus.filelimit = fileManager_1.FileManager.getSize(+const_1.FILELIMIT);
                response_1.Response.data.diskstatus.status = status;
                resolve(response_1.Response.export());
            });
        });
    }
}
exports.statusController = new StatusController();
