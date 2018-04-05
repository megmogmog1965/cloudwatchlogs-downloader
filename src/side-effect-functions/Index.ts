
import * as os from 'os';
import * as utils from '../utils';
import { Settings } from '../common-interfaces/Settings';
const storage = (<any> window).require('electron-json-storage'); // @see https://github.com/electron/electron/issues/7300

export function applicationPassphrase(): string {
  let seed = utils.hash(os.hostname());
  return utils.random(seed).toString(36).slice(-8);
}

export function save(settings: Settings): void {
  let crypted: Settings = {
    region: settings.region,
    awsAccessKeyId: utils.encrypt(settings.awsAccessKeyId, applicationPassphrase()),
    awsSecretAccessKey: utils.encrypt(settings.awsSecretAccessKey, applicationPassphrase()),
  };

  storage.set('aws', crypted, (err: object) => console.log(err));
  console.log(storage.getDataPath());
}

export function load(): Promise<Settings> {
  let decrypted = (settings: Settings) => {
    return {
      region: settings.region,
      awsAccessKeyId: utils.decrypt(settings.awsAccessKeyId, applicationPassphrase()),
      awsSecretAccessKey: utils.decrypt(settings.awsSecretAccessKey, applicationPassphrase()),
    };
  };

  return new Promise<Settings>((resolve, reject) => {
    storage.get('aws', function(error: object, data: Settings) {
      if (error) {
        reject(error);
      } else {
        resolve(decrypted(data));
      }
    });
  });
}
