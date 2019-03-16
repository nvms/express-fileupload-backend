import { NextFunction, Request, Response, Router } from 'express';
import { fileController } from '../controllers/fileController';
import { Response as Rp } from '../config/response';

export class FileRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public async getFiles(req: Request, res: Response, next: NextFunction) {
    res.json(await fileController.getFiles().catch((err) => {
      console.log(err);
      Rp.errors.push(err);
      return Rp.export();
    }));
  }

  public async postFile(req: Request, res: Response, next: NextFunction) {
    res.json(await fileController.postFile(req).catch((err) => {
      console.log(err);
      Rp.errors.push(err);
      return Rp.export();
    }));
  }

  public async delFile(req: Request, res: Response, next: NextFunction) {
    res.json(await fileController.delFile(req).catch((err) => {
      console.log(err);
      Rp.errors.push(err);
      return Rp.export();
    }));
  }

  public init() {
    this.router.get('/', this.getFiles);
    this.router.post('/', this.postFile);
    this.router.delete('/:id', this.delFile);

  }
}

const fileRouter = new FileRouter();
fileRouter.init();

export default fileRouter.router;