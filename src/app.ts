// Import libraries.
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as express_fileupload from 'express-fileupload';
import * as logger from 'morgan';
import * as statusMonitor from 'express-status-monitor';

// Import config, the response template, and the utils (in this case the jwt manager).
import { Response as Rp } from './config/response';
import { statusMonitorConfiguration } from './config/statusMonitor_config';
import { STATIC, TMP, EXTERNALSTATIC, FILELIMIT, APIV1 } from './config/const';

// Imports the routers.
import fileRouter from './routes/fileRouter';
import statusRouter from './routes/statusRouter';

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.middleware();
  }

  private async middleware(): Promise<any> {

    // initializatin the libraries and the express config.
    this.app.use(cors()); // Allows Control Acess Protol to work outside of a localhost.
    this.app.use(compression()); // Compresses the requests.
    this.app.use(logger('dev')); // Logs the activity to the console. (It can be configured to write it to a file).
    this.app.use(express_fileupload(
      {
        debug: false,
        limits: { fileSize: FILELIMIT },
        abortOnLimit: false,
        preserveExtension: true,
        useTempFiles: true,
        tempFileDir: 'tmp'},
      )); // Manages the file uploads and adds a limit.
    this.app.use(EXTERNALSTATIC, express.static(STATIC)); // Exposes a static folder to the exterior.
    this.app.use(statusMonitor(statusMonitorConfiguration));

    this.app.use((req, res, next) => {
      Rp.clearData();
      next();
    });

    // Routers
    this.app.use(`${APIV1}music`, fileRouter);
    this.app.use(`${APIV1}status`, statusRouter);
  }
}

export default new App().app;
