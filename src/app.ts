// Import libraries.
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as express_fileupload from 'express-fileupload';
import * as logger from 'morgan';
import * as path from 'path';
import * as statusMonitor from 'express-status-monitor';

// Import config, the response template, and the utils (in this case the jwt manager).
import { Response as Rp } from './config/response';
import { statusMonitorConfiguration } from './config/statusMonitor_config';
import { STATIC } from './config/const';

// Imports the routers.
import fileRouter from './routes/fileRouter';

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
    this.app.use(bodyParser.json({ limit: '100mb' })); // Parses automaticallythe requests, and adds a limit.
    this.app.use(bodyParser.urlencoded({ extended: false, limit: '100mb' })); // Manages the encoded urls, and adds a limit.
    this.app.use(express_fileupload(
      {
        debug: true,
        abortOnLimit: true,
        preserveExtension: true,
        useTempFiles : true,
        tempFileDir : path.join(STATIC, 'tmp')},
      )); // Manages the file uploads and adds a limit.
    this.app.use('/api/v1/static', express.static(STATIC)); // Exposes a static folder to the exterior.
    this.app.use(statusMonitor(statusMonitorConfiguration));

    this.app.use((req, res, next) => {
      Rp.clearData();
      next();
    });

    // Routers
    this.app.use('/api/v1/music', fileRouter);
  }
}

export default new App().app;
