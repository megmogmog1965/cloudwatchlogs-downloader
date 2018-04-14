import { ActionTypes } from '../constants';
import * as enums from '../enums';
import { Dispatch } from 'redux';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as zlib from 'zlib';
import { LogGroup, LogStream } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';
import { getCloudWatchLogsEvents } from '../side-effect-functions';

//////////// Action object interfaces ////////////

export interface ShowWindowContent {
  type: ActionTypes.SHOW_WINDOW_CONTENT;
  windowContent: enums.WindowContent;
}

export interface RequestLogGroups {
  type: ActionTypes.REQUEST_LOG_GROUPS;
}

export interface ReceiveLogGroups {
  type: ActionTypes.RECEIVE_LOG_GROUPS;
  logGroups: LogGroup[];
  lastModified: Date;
}

export interface ErrorLogGroups {
  type: ActionTypes.ERROR_LOG_GROUPS;
  errorMessage: string;
}

export interface SelectLogGroup {
  type: ActionTypes.SELECT_LOG_GROUP;
  selectedName?: string;
}

export interface RequestLogStreams {
  type: ActionTypes.REQUEST_LOG_STREAMS;
}

export interface ReceiveLogStreams {
  type: ActionTypes.RECEIVE_LOG_STREAMS;
  logStreams: LogStream[];
  lastModified: Date;
}

export interface ErrorLogStreams {
  type: ActionTypes.ERROR_LOG_STREAMS;
  errorMessage: string;
}

export interface SelectLogStream {
  type: ActionTypes.SELECT_LOG_STREAM;
  selectedName?: string;
}

export interface RequestLogEvents {
  type: ActionTypes.REQUEST_LOG_EVENTS;
  id: string;
}

export interface ReceiveLogEvents {
  type: ActionTypes.RECEIVE_LOG_EVENTS;
  id: string;
}

export interface ErrorLogEvents {
  type: ActionTypes.ERROR_LOG_EVENTS;
  id: string;
}

export interface SetDateRange {
  type: ActionTypes.SET_DATERANGE;
  startDate: Date;
  endDate: Date;
}

export interface SaveSettings {
  type: ActionTypes.SAVE_SETTINGS;
  settings: Settings;
  lastModified: Date;
}

export interface ReceiveSettings {
  type: ActionTypes.RECEIVE_SETTINGS;
  settings: Settings;
  lastModified: Date;
}

//////////// Action types ////////////

export type WindowAction = ShowWindowContent;

export type LogGroupAction = RequestLogGroups | ReceiveLogGroups | ErrorLogGroups | SelectLogGroup;

export type LogStreamAction = RequestLogStreams | ReceiveLogStreams | ErrorLogStreams | SelectLogStream;

export type LogEventAction = RequestLogEvents | ReceiveLogEvents | ErrorLogEvents;

export type DateRangeAction = SetDateRange;

export type SettingsAction = SaveSettings | ReceiveSettings;

//////////// Actions ////////////

export function showWindowContent(windowContent: enums.WindowContent): ShowWindowContent {
  return {
    type: ActionTypes.SHOW_WINDOW_CONTENT,
    windowContent: windowContent,
  };
}

export function reloadAll(settings: Settings, logGroupName?: string, logStreamName?: string): (dispatch: Dispatch<LogGroupAction>) => void {
  // calls other actions.
  return (dispatch: Dispatch<LogGroupAction>) => {
    dispatch(fetchLogGroups(settings));

    if (logGroupName) {
      dispatch(fetchLogStreams(settings, logGroupName));
    }
  };
}

export function requestLogGroups(): RequestLogGroups {
  return {
    type: ActionTypes.REQUEST_LOG_GROUPS,
  };
}

export function receiveLogGroups(logGroups: LogGroup[], lastModified: Date): ReceiveLogGroups {
  return {
    type: ActionTypes.RECEIVE_LOG_GROUPS,
    logGroups: logGroups,
    lastModified: lastModified,
  };
}

export function errorLogGroups(errorMessage: string): ErrorLogGroups {
  return {
    type: ActionTypes.ERROR_LOG_GROUPS,
    errorMessage: errorMessage,
  };
}

export function fetchLogGroups(settings: Settings): (dispatch: Dispatch<LogGroupAction>) => void {
  return (dispatch: Dispatch<LogGroupAction>) => {

    if (!settings.region || !settings.awsAccessKeyId || !settings.awsSecretAccessKey) {
      return;
    }

    const cloudwatchlogs = new AWS.CloudWatchLogs({
      region: settings.region,
      accessKeyId: settings.awsAccessKeyId,
      secretAccessKey: settings.awsSecretAccessKey,
    });

    dispatch(requestLogGroups());

    let fetchRecursively = (groups: LogGroup[], nextToken?: string) => {
      cloudwatchlogs.describeLogGroups({ nextToken }, (err, data) => {
        let now = new Date();

        if (err) {
          dispatch(errorLogGroups(err.message));
          return;
        }

        if (!data.logGroups) {
          dispatch(receiveLogGroups([], now));
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

        if (!data.nextToken) {
          dispatch(receiveLogGroups(merged, now));
          return;
        }

        // call recursively.
        fetchRecursively(merged, data.nextToken);
      });
    };

    fetchRecursively([]);
  };
}

export function selectLogGroup(selectedName?: string): SelectLogGroup {
  return {
    type: ActionTypes.SELECT_LOG_GROUP,
    selectedName: selectedName,
  };
}

export function requestLogStreams(): RequestLogStreams {
  return {
    type: ActionTypes.REQUEST_LOG_STREAMS,
  };
}

export function receiveLogStreams(logStreams: LogStream[], lastModified: Date): ReceiveLogStreams {
  return {
    type: ActionTypes.RECEIVE_LOG_STREAMS,
    logStreams: logStreams,
    lastModified: lastModified,
  };
}

export function errorLogStreams(errorMessage: string): ErrorLogStreams {
  return {
    type: ActionTypes.ERROR_LOG_STREAMS,
    errorMessage: errorMessage,
  };
}

export function fetchLogStreams(settings: Settings, logGroupName: string): (dispatch: Dispatch<LogStreamAction>) => void {
  return (dispatch: Dispatch<LogStreamAction>) => {

    if (!settings.region || !settings.awsAccessKeyId || !settings.awsSecretAccessKey || !logGroupName) {
      return;
    }

    const cloudwatchlogs = new AWS.CloudWatchLogs({
      region: settings.region,
      accessKeyId: settings.awsAccessKeyId,
      secretAccessKey: settings.awsSecretAccessKey,
    });

    dispatch(requestLogStreams());

    let fetchRecursively = (streams: LogStream[], nextToken?: string) => {
      cloudwatchlogs.describeLogStreams({ logGroupName, descending: true, orderBy: 'LastEventTime', nextToken }, (err, data) => {
        let now = new Date();

        if (err) {
          dispatch(errorLogGroups(err.message));
          return;
        }

        if (!data.logStreams) {
          dispatch(receiveLogGroups([], now));
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

        if (!data.nextToken) {
          dispatch(receiveLogStreams(merged, now));
          return;
        }

        // call recursively.
        fetchRecursively(merged, data.nextToken);
      });
    };

    fetchRecursively([]);
  };
}

export function selectLogStream(selectedName?: string): SelectLogStream {
  return {
    type: ActionTypes.SELECT_LOG_STREAM,
    selectedName: selectedName,
  };
}

export function setDateRange(startDate: Date, endDate: Date): SetDateRange {
  return {
    type: ActionTypes.SET_DATERANGE,
    startDate,
    endDate,
  };
}

export function requestLogEvents(id: string): RequestLogEvents {
  return {
    type: ActionTypes.REQUEST_LOG_EVENTS,
    id,
  };
}

export function receiveLogEvents(id: string): ReceiveLogEvents {
  return {
    type: ActionTypes.RECEIVE_LOG_EVENTS,
    id,
  };
}

export function errorLogEvents(id: string): ErrorLogEvents {
  return {
    type: ActionTypes.ERROR_LOG_EVENTS,
    id,
  };
}

export function downloadLogs(
  settings: Settings,
  logGroupName: string,
  logStreamName: string,
  startDate: Date,
  endDate: Date,
  fileChooser: () => string | undefined,
): (dispatch: Dispatch<LogGroupAction>) => void {

  return (dispatch: Dispatch<LogGroupAction>) => {
    let filename = fileChooser();
    if (!filename) {
      return; // "cancel" chosen.
    }

    const id = uuid();
    dispatch(requestLogEvents(id));

    // open write stream.
    let rawstream = fs.createWriteStream(filename);
    let out = filename.endsWith('.gz') ? zlib.createGzip().pipe(rawstream) : rawstream;

    getCloudWatchLogsEvents(
      settings,
      logGroupName,
      logStreamName,
      startDate,
      endDate,
      (data) => {
        if (!data.events) {
          return;
        }

        let messages = data.events
          .filter(e => e != null)
          .map(e => e.message!.trim())  // @fixme user should choose LF/CRLF/Raw.
          .join('\n');  // @fixme user should choose LF/CRLF/Raw.
        out.write(messages);

        dispatch(receiveLogEvents(id));
      },
      (err) => {
        out.end();
        dispatch(errorLogEvents(id));
      },
      () => {
        out.end();
        dispatch(receiveLogEvents(id));
      },
    );
  };
}

export function saveSettings(settings: Settings, lastModified: Date, save: (settings: Settings) => void): SaveSettings {
  // save settings to app local.
  save(settings);

  return {
    type: ActionTypes.SAVE_SETTINGS,
    settings: settings,
    lastModified: lastModified,
  };
}

export function loadSettings(load: () => Promise<Settings>): (dispatch: Dispatch<LogGroupAction>) => void {
  return (dispatch: Dispatch<LogGroupAction>) => {
    load().then((settings: Settings) => {
      dispatch(receiveSettings(settings, new Date()));
    });
  };
}

export function receiveSettings(settings: Settings, lastModified: Date): ReceiveSettings {
  return {
    type: ActionTypes.RECEIVE_SETTINGS,
    settings: settings,
    lastModified: lastModified,
  };
}
