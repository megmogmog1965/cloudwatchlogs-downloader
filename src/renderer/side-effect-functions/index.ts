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
  callbackEnd: (time: Date, logGroups: LogGroup[], nextToken?: string) => void,
  nextLogGroupsToken?: string,
  retryDelay = 1000,
): void {

  callbackStart(new Date());

  let fetchRecursively = (groups: LogGroup[], nextToken?: string, retry = 3) => {
    cloudwatchlogs.describeLogGroups({ nextToken }, (err, data) => {
      let now = new Date();

      if (err) {
        if (retry > 0) {
          // @see https://docs.amazonaws.cn/en_us/AmazonCloudWatch/latest/logs/cloudwatch_limits_cwl.html
          setTimeout(() => fetchRecursively(groups, nextToken, retry - 1), retryDelay); // wait 1 secs until next try.
          return;
        }

        callbackError(now, err);
        return;
      }

      if (!data.logGroups) {
        callbackEnd(now, groups);
        return;
      }

      let part: LogGroup[] = data.logGroups
        .filter(g => g.arn != null)
        .filter(g => g.logGroupName != null)
        .filter(g => g.creationTime != null)
        .filter(g => g.storedBytes != null)
        .map(g => ({
          arn: g.arn!,
          logGroupName: g.logGroupName!,
          creationTime: g.creationTime!,
          storedBytes: g.storedBytes!,
        }));

      let merged = groups.concat(part);

      // end of groups.
      if (!data.nextToken) {
        callbackEnd(now, merged);
        return;
      }

      // paging with limit.
      if (merged.length > 1000) {
        callbackEnd(now, merged, data.nextToken);
        return;
      }

      // call recursively.
      fetchRecursively(merged, data.nextToken);
    });
  };

  fetchRecursively([], nextLogGroupsToken);
}

export function getCloudWatchLogStreams(
  cloudwatchlogs: AWS.CloudWatchLogs,
  logGroupName: string,
  callbackStart: (time: Date) => void,
  callbackError: (time: Date, err: AWS.AWSError) => void,
  callbackEnd: (time: Date, logStreams: LogStream[], nextToken?: string) => void,
  nextLogStreamsToken?: string,
  retryDelay = 1000,
): void {

  callbackStart(new Date());

  let fetchRecursively = (streams: LogStream[], nextToken?: string, retry = 3) => {
    cloudwatchlogs.describeLogStreams({ logGroupName, descending: true, orderBy: 'LastEventTime', nextToken }, (err, data) => {
      let now = new Date();

      if (err) {
        if (retry > 0) {
          // @see https://docs.amazonaws.cn/en_us/AmazonCloudWatch/latest/logs/cloudwatch_limits_cwl.html
          setTimeout(() => fetchRecursively(streams, nextToken, retry - 1), retryDelay); // wait 1 secs until next try.
          return;
        }

        callbackError(now, err);
        return;
      }

      if (!data.logStreams) {
        callbackEnd(now, streams);
        return;
      }

      let part: LogStream[] = data.logStreams
        .filter(g => typeof g.arn != null)
        .filter(g => g.logStreamName != null)
        .filter(g => g.creationTime != null)
        .filter(g => g.firstEventTimestamp != null)
        .filter(g => g.lastEventTimestamp != null)
        .filter(g => g.storedBytes != null)
        .map(g => ({
          arn: g.arn!,
          logStreamName: g.logStreamName!,
          creationTime: g.creationTime!,
          firstEventTimestamp: g.firstEventTimestamp!,
          lastEventTimestamp: g.lastEventTimestamp!,
          storedBytes: g.storedBytes!,
        }));

      let merged = streams.concat(part);

      // end of streams.
      if (!data.nextToken) {
        callbackEnd(now, merged);
        return;
      }

      // paging with limit.
      if (merged.length > 1000) {
        callbackEnd(now, merged, data.nextToken);
        return;
      }

      // call recursively.
      fetchRecursively(merged, data.nextToken);
    });
  };

  fetchRecursively([], nextLogStreamsToken);
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

  let createParams = (nextToken?: string) => {
    return {
      logGroupName: logGroupName,
      logStreamName: logStreamName,
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
      limit: limit,
      nextToken: nextToken,
      startFromHead: startFromHead,
    };
  };

  let fetchRecursively = (nextToken?: string, retry = 3) => {
    cloudwatchlogs.getLogEvents(
      createParams(nextToken),
      (err, data) => {
        // error.
        if (err) {
          if (retry > 0) {
            // @see https://docs.amazonaws.cn/en_us/AmazonCloudWatch/latest/logs/cloudwatch_limits_cwl.html
            setTimeout(() => fetchRecursively(nextToken, retry - 1), retryDelay); // wait 2 secs until next try.
            return;
          }

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
        if (data.events && data.events.length > 0) {
          let latestTimestamp = data.events[data.events.length - 1].timestamp;
          let progress = latestTimestamp ? utils.progressAt(new Date(latestTimestamp), startDate, endDate) : 0;
          callbackData(data, progress);
        }

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

export function connectCloudWatchLogs(settings: Settings): AWS.CloudWatchLogs {
  return new AWS.CloudWatchLogs({
    region: settings.region,
    accessKeyId: settings.awsAccessKeyId,
    secretAccessKey: settings.awsSecretAccessKey,
  });
}
