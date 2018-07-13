import * as os from 'os';
import * as fs from 'fs';
import * as zlib from 'zlib';
import * as stream from 'stream';
import { v4 as uuid } from 'uuid';
import { remote } from 'electron';
import * as utils from '../utils';
import * as AWS from 'aws-sdk';
import sanitize from 'sanitize-filename';
import { LogGroup, LogStream, Settings } from '../common-interfaces';
import * as storage from 'electron-json-storage';
import * as constants from '../constants';

const dialog = remote.dialog;

export function applicationPassphrase(): string {
  let seed = utils.hash(os.type() + os.hostname() + 'ufQROog1Q8');
  return utils.random(seed, 100000000000, 1000000000000).toString(36).slice(0, 8) + '_xiONGor6G9!';
}

export function createUuid(): string {
  let id = uuid();
  return id;
}

export function currentDate(): Date {
  return new Date();
}

export function save(settings: Settings): void {
  let crypted: Settings = {
    region: settings.region,
    awsAccessKeyId: utils.encrypt(settings.awsAccessKeyId, applicationPassphrase()),
    awsSecretAccessKey: utils.encrypt(settings.awsSecretAccessKey, applicationPassphrase()),
    lineBreak: settings.lineBreak,
    filters: settings.filters,
  };

  storage.set('aws', crypted, (err: object) => console.log(err));
}

export function load(): Promise<Settings> {
  let decrypted = (settings: Settings) => {
    return {
      region: settings.region,
      awsAccessKeyId: utils.decrypt(settings.awsAccessKeyId, applicationPassphrase()),
      awsSecretAccessKey: utils.decrypt(settings.awsSecretAccessKey, applicationPassphrase()),
      lineBreak: settings.lineBreak,
      filters: settings.filters,
    };
  };

  return new Promise<Settings>((resolve, reject) => {
    // console.log(storage.getDataPath());
    storage.get('aws', (error: object, data: any) => {
      if (error) {
        reject(error);
      } else {
        let settings: Settings = {
          region: (typeof data.region === 'string') ? data.region : constants.Region.AP_NORTHEAST_1,
          awsAccessKeyId: (typeof data.awsAccessKeyId === 'string') ? data.awsAccessKeyId : '',
          awsSecretAccessKey: (typeof data.awsSecretAccessKey === 'string') ? data.awsSecretAccessKey : '',
          lineBreak: (typeof data.lineBreak === 'string') ? data.lineBreak : constants.LineBreak.LF,
          filters: (Array.isArray(data.filters)) ? data.filters : [],
        };
        resolve(decrypted(settings));
      }
    });
  });
}

export function showSaveDialog(fileName?: string): stream.Writable | undefined {
  let filePath = dialog.showSaveDialog({
    defaultPath: fileName ? sanitize(fileName) : undefined,
    filters: [
      { name: 'Raw Text', extensions: ['txt'] },
      { name: 'GZip', extensions: ['gz'] },
    ],
  });

  // cancel chosen.
  if (!filePath) {
    return undefined;
  }

  // open write stream.
  let out = fs.createWriteStream(filePath);

  // or gzip ?
  if (filePath.endsWith('.gz')) {
    let gzip = zlib.createGzip();
    gzip.pipe(out);

    return gzip;
  }

  return out;
}

export function getCloudWatchLogGroups(
  cloudwatchlogs: AWS.CloudWatchLogs,
  callbackStart: (time: Date) => void,
  callbackError: (time: Date, err: AWS.AWSError) => void,
  callbackEnd: (time: Date, logGroups: LogGroup[]) => void,
  retryDelay = 1000,
): void {

  //////////// stub ////////////
  let now = new Date().getTime();
  let prev = (t: number, days: number) => t - days * 24 * 60 * 60 * 1000;

  callbackStart(new Date());

  callbackEnd(
    new Date(),
    [
      { arn: 'arn1', logGroupName: 'Log group 1', creationTime: prev(now, 3), storedBytes: 52428800 },
      { arn: 'arn2', logGroupName: 'Log group 2', creationTime: prev(now, 3), storedBytes: 52428800 },
      { arn: 'arn3', logGroupName: 'Log group 3', creationTime: prev(now, 3), storedBytes: 52428800 },
      { arn: 'arn4', logGroupName: 'Log group 4', creationTime: prev(now, 3), storedBytes: 52428800 },
    ],
  );
  //////////// stub ////////////
}

export function getCloudWatchLogStreams(
  cloudwatchlogs: AWS.CloudWatchLogs,
  logGroupName: string,
  callbackStart: (time: Date) => void,
  callbackError: (time: Date, err: AWS.AWSError) => void,
  callbackEnd: (time: Date, logStreams: LogStream[]) => void,
  retryDelay = 1000,
): void {

  //////////// stub ////////////
  let now = new Date().getTime();
  let prev = (t: number, days: number) => t - days * 24 * 60 * 60 * 1000;

  callbackStart(new Date());

  callbackEnd(
    new Date(),
    [
      { arn: 'arn1', logStreamName: 'Log stream 1', creationTime: 1524520727000, firstEventTimestamp: prev(now, 1), lastEventTimestamp: now, storedBytes: 52428800 },
      { arn: 'arn2', logStreamName: 'Log stream 2', creationTime: 1524520727000, firstEventTimestamp: prev(now, 1), lastEventTimestamp: now, storedBytes: 52428800 },
      { arn: 'arn3', logStreamName: 'Log stream 3', creationTime: 1524520727000, firstEventTimestamp: prev(now, 2), lastEventTimestamp: prev(now, 1), storedBytes: 52428800 },
      { arn: 'arn4', logStreamName: 'Log stream 4', creationTime: 1524520727000, firstEventTimestamp: prev(now, 3), lastEventTimestamp: prev(now, 1), storedBytes: 52428800 },
      { arn: 'arn5', logStreamName: 'Log stream 5', creationTime: 1524520727000, firstEventTimestamp: prev(now, 3), lastEventTimestamp: prev(now, 2), storedBytes: 52428800 },
      { arn: 'arn6', logStreamName: 'Log stream 6', creationTime: 1524520727000, firstEventTimestamp: prev(now, 3), lastEventTimestamp: prev(now, 2), storedBytes: 52428800 },
    ],
  );
  //////////// stub ////////////
}

export function getCloudWatchLogsEvents(
  cloudwatchlogs: AWS.CloudWatchLogs,
  logGroupName: string,
  logStreamName: string,
  startDate: Date,
  endDate: Date,
  callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
  callbackError: (err: AWS.AWSError) => void,
  callbackEnd: () => void,
  startFromHead = true,
  limit?: number,
  retryDelay = 2000,
): void {

  //////////// stub ////////////
  let now = new Date().getTime();
  let events = (lines: number) => {
    return Array.from(Array(20).keys())
      .map(i => now - i * 1000)
      .map(t => ({
        timestamp: t,
        message: new Date(t).toISOString() + ' INFO .......................',
      }));
  };

  callbackData(
    {
      events: events(100),
    } as any,
    0,
  );

  callbackEnd();
  //////////// stub ////////////
}

export function connectCloudWatchLogs(settings: Settings): AWS.CloudWatchLogs {
  return new AWS.CloudWatchLogs({
    region: settings.region,
    accessKeyId: settings.awsAccessKeyId,
    secretAccessKey: settings.awsSecretAccessKey,
  });
}
