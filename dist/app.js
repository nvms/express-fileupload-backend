"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compression = require("compression");
const cors = require("cors");
const express = require("express");
const express_fileupload = require("express-fileupload");
const logger = require("morgan");
const statusMonitor = require("express-status-monitor");
// Import config, the response template, and the utils (in this case the jwt manager).
const response_1 = require("./config/response");
const statusMonitor_config_1 = require("./config/statusMonitor_config");
const const_1 = require("./config/const");
// Imports the routers.
const fileRouter_1 = require("./routes/fileRouter");
const statusRouter_1 = require("./routes/statusRouter");
class App {
    constructor() {
        this.app = express();
        this.middleware();
    }
    async middleware() {
        // initializatin the libraries and the express config.
        this.app.use(cors()); // Allows Control Acess Protol to work outside of a localhost.
        this.app.use(compression()); // Compresses the requests.
        this.app.use(logger('dev')); // Logs the activity to the console. (It can be configured to write it to a file).
        this.app.use(express_fileupload({
            debug: false,
            limits: { fileSize: const_1.FILELIMIT },
            abortOnLimit: false,
            preserveExtension: true,
            useTempFiles: true,
            tempFileDir: 'tmp'
        })); // Manages the file uploads and adds a limit.
        this.app.use(const_1.EXTERNALSTATIC, express.static(const_1.STATIC)); // Exposes a static folder to the exterior.
        this.app.use(statusMonitor(statusMonitor_config_1.statusMonitorConfiguration));
        this.app.use((req, res, next) => {
            response_1.Response.clearData();
            next();
        });
        // Routers
        this.app.use(`${const_1.APIV1}music`, fileRouter_1.default);
        this.app.use(`${const_1.APIV1}status`, statusRouter_1.default);
    }
}
exports.default = new App().app;
