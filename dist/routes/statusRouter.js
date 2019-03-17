"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statusController_1 = require("../controllers/statusController");
const response_1 = require("../config/response");
class FileRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    async getStatus(req, res, next) {
        res.json(await statusController_1.statusController.getStatus().catch((err) => {
            console.log(err);
            response_1.Response.errors.push(err);
            return response_1.Response.export();
        }));
    }
    init() {
        this.router.get('/', this.getStatus);
    }
}
exports.FileRouter = FileRouter;
const statusRouter = new FileRouter();
statusRouter.init();
exports.default = statusRouter.router;
