import * as os from 'os';
import * as utils from '../utils';
import * as AWS from 'aws-sdk';
import { Settings } from '../common-interfaces/Settings';
const storage = (window as any).require('electron-json-storage'); // @see https://github.com/electron/electron/issues/7300

// declaration for external variables.
declare var dialog: any;

export function applicationPassphrase(): string {
  let seed = utils.hash(os.type() + os.release() + os.hostname() + 'ufQROog1Q8');
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

export function showSaveDialog(): string {
  return dialog.showSaveDialog({
    filters: [
      { name: 'Raw Text', extensions: ['txt'] },
      { name: 'GZip', extensions: ['gz'] },
    ],
  });
}

export function getCloudWatchLogsEvents(
  settings: Settings,
  logGroupName: string,
  logStreamName: string,
  startDate: Date,
  endDate: Date,
  callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
  callbackError: (err: AWS.AWSError) => void,
  callbackEnd: () => void,
  limit?: number): void {

  // authorization for aws-sdk.
  const cloudwatchlogs = new AWS.CloudWatchLogs({
    region: settings.region,
    accessKeyId: settings.awsAccessKeyId,
    secretAccessKey: settings.awsSecretAccessKey,
  });

  let createParams = (nextToken?: string) => {
    return {
      logGroupName: logGroupName,
      logStreamName: logStreamName,
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
      limit: limit,
      nextToken: nextToken,
      startFromHead: true,
    };
  };

  let fetchRecursively = (nextToken?: string) => {
    cloudwatchlogs.getLogEvents(
      createParams(nextToken),
      (err, data) => {
        // error.
        if (err) {
          callbackError(err);
          return;
        }

        // end of recursive calls.
        let latestToken = data.nextForwardToken;
        if (!latestToken || nextToken === latestToken) {
          callbackEnd();
          return;
        }

        // something to be done on callback.
        callbackData(data);

        // one time call by limit.
        if (limit) {
          callbackEnd();
          return;
        }

        // call itself recursively.
        fetchRecursively(latestToken);
      });
  };

  fetchRecursively();
}
