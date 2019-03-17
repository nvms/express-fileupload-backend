import { Response as Rp } from '../config/response';
import { FileManager } from '../utils/fileManager';
import { FILELIMIT } from '../config/const';
import * as diskspace from 'diskspace';
import * as path from 'path';
import * as os from 'os';

class StatusController {
  // Get all Files
  public async getStatus() {
    return new Promise((resolve, reject) => {
      const OSRoot = (os.platform() === 'win32') ? process.cwd().split(path.sep)[0] : '/';
      diskspace.check(OSRoot, (err, result) => {
        if (err) {
          console.log(err);
          Rp.errors.push('error retrieving server info.');
          reject(new Error(err));
        }

        const { total, used, free, status } = result;
        Rp.data.diskstatus = {};
        Rp.data.diskstatus.disk = OSRoot;
        Rp.data.diskstatus.total = FileManager.getSize(+total);
        Rp.data.diskstatus.used = FileManager.getSize(+used);
        Rp.data.diskstatus.free = FileManager.getSize(+free);
        Rp.data.diskstatus.filelimit = FileManager.getSize(+FILELIMIT);
        Rp.data.diskstatus.status = status;
        resolve(Rp.export());
      });
    });
  }
}

export const statusController = new StatusController();
