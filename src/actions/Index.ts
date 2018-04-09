import { ActionTypes } from '../constants';
import * as enums from '../enums';
import { Dispatch } from 'redux';
import * as AWS from 'aws-sdk';
import { LogGroup, LogStream } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';

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
    type: ActionTypes.REQUEST_LOG_GROUPS
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

    cloudwatchlogs.describeLogGroups({}, (err, data) => {
      let now = new Date();

      if (err) {
        dispatch(errorLogGroups(err.message));
        return;
      }

      if (!data.logGroups) {
        dispatch(receiveLogGroups([], now));
        return;
      }

      let groups: LogGroup[] = data.logGroups
        .filter(g => g.arn)
        .filter(g => g.logGroupName)
        .filter(g => g.creationTime)
        .filter(g => g.storedBytes)
        .map(g => ({
          arn: g.arn!,
          logGroupName: g.logGroupName!,
          creationTime: g.creationTime!,
          storedBytes: g.storedBytes!
        }));

      dispatch(receiveLogGroups(groups, now));
    });
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
    type: ActionTypes.REQUEST_LOG_STREAMS
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

    cloudwatchlogs.describeLogStreams({ logGroupName, descending: true, orderBy: 'LastEventTime' }, (err, data) => {
      let now = new Date();

      if (err) {
        dispatch(errorLogGroups(err.message));
        return;
      }

      if (!data.logStreams) {
        dispatch(receiveLogGroups([], now));
        return;
      }

      let streams: LogStream[] = data.logStreams
        .filter(g => g.arn)
        .filter(g => g.logStreamName)
        .filter(g => g.creationTime)
        .filter(g => g.firstEventTimestamp)
        .filter(g => g.lastEventTimestamp)
        .filter(g => g.storedBytes)
        .map(g => ({
          arn: g.arn!,
          logStreamName: g.logStreamName!,
          creationTime: g.creationTime!,
          firstEventTimestamp: g.firstEventTimestamp!,
          lastEventTimestamp: g.lastEventTimestamp!,
          storedBytes: g.storedBytes!,
        }));

      dispatch(receiveLogStreams(streams, now));
    });
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

export function saveSettings(settings: Settings, lastModified: Date, save: (settings: Settings) => void): SaveSettings {
  // save settings to app local.
  save(settings);

  return {
    type: ActionTypes.SAVE_SETTINGS,
    settings: settings,
    lastModified: lastModified,
  };
}

export function loadSettings(load: () => Promise<Settings>) {
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
