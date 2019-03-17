import { NextFunction, Request, Response, Router } from 'express';
import { statusController } from '../controllers/statusController';
import { Response as Rp } from '../config/response';

export class FileRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public async getStatus(req: Request, res: Response, next: NextFunction) {
    res.json(await statusController.getStatus().catch((err) => {
      console.log(err);
      Rp.errors.push(err);
      return Rp.export();
    }));
  }

  public init() {
    this.router.get('/', this.getStatus);
  }
}

const statusRouter = new FileRouter();
statusRouter.init();

export default statusRouter.router;