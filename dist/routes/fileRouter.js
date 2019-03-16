"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileController_1 = require("../controllers/fileController");
const response_1 = require("../config/response");
class FileRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    async getFiles(req, res, next) {
        res.json(await fileController_1.fileController.getFiles().catch((err) => {
            console.log(err);
            response_1.Response.errors.push(err);
            return response_1.Response.export();
        }));
    }
    async postFile(req, res, next) {
        res.json(await fileController_1.fileController.postFile(req).catch((err) => {
            console.log(err);
            response_1.Response.errors.push(err);
            return response_1.Response.export();
        }));
    }
    async delFile(req, res, next) {
        res.json(await fileController_1.fileController.delFile(req).catch((err) => {
            console.log(err);
            response_1.Response.errors.push(err);
            return response_1.Response.export();
        }));
    }
    init() {
        this.router.get('/', this.getFiles);
        this.router.post('/', this.postFile);
        this.router.delete('/:music', this.delFile);
    }
}
exports.FileRouter = FileRouter;
const fileRouter = new FileRouter();
fileRouter.init();
exports.default = fileRouter.router;
