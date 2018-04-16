import { ActionTypes, LineBreak } from '../constants';
import * as enums from '../enums';
import { Dispatch } from 'redux';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as stream from 'stream';
import { LogGroup, LogStream } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';
import * as voca from 'voca';

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

export function fetchLogGroups(
  settings: Settings,
  getCloudWatchLogGroups: (
    callbackStart: (time: Date) => void,
    callbackError: (time: Date, err: AWS.AWSError) => void,
    callbackEnd: (time: Date, logGroups: LogGroup[]) => void,
  ) => void,
): (dispatch: Dispatch<LogGroupAction>) => void {

  return (dispatch: Dispatch<LogGroupAction>) => {
    if (!settings.region || !settings.awsAccessKeyId || !settings.awsSecretAccessKey) {
      return;
    }

    getCloudWatchLogGroups(
      (time: Date) => dispatch(requestLogGroups()),
      (time: Date, err: AWS.AWSError) => dispatch(errorLogGroups(err.message)),
      (time: Date, logGroups: LogGroup[]) => dispatch(receiveLogGroups(logGroups, time)),
    );
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

export function fetchLogStreams(
  settings: Settings,
  logGroupName: string,
  getCloudWatchLogStreams: (
    callbackStart: (time: Date) => void,
    callbackError: (time: Date, err: AWS.AWSError) => void,
    callbackEnd: (time: Date, logStreams: LogStream[]) => void,
  ) => void,
): (dispatch: Dispatch<LogStreamAction>) => void {

  return (dispatch: Dispatch<LogStreamAction>) => {
    if (!settings.region || !settings.awsAccessKeyId || !settings.awsSecretAccessKey || !logGroupName) {
      return;
    }

    getCloudWatchLogStreams(
      (time: Date) => dispatch(requestLogStreams()),
      (time: Date, err: AWS.AWSError) => dispatch(errorLogStreams(err.message)),
      (time: Date, logStreams: LogStream[]) => dispatch(receiveLogStreams(logStreams, time)),
    );
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
  getCloudWatchLogsEvents: (
    callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
    callbackError: (err: AWS.AWSError) => void,
    callbackEnd: () => void,
  ) => void,
  fileChooser: () => stream.Writable | undefined,
): (dispatch: Dispatch<LogGroupAction>) => void {

  return (dispatch: Dispatch<LogGroupAction>) => {
    // it returns a file that user choosed.
    let choosed = fileChooser();
    if (!choosed) {
      return; // "cancel" chosen.
    }
    const out = choosed;

    // create job id.
    const id = uuid();
    dispatch(requestLogEvents(id));

    // callback for receive log chunks.
    let callbackData = (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => {
      if (!data.events) {
        return;
      }

      let trimmer: (e: AWS.CloudWatchLogs.OutputLogEvent) => string = (settings.lineBreak === LineBreak.NO_MODIFICATION) ?
        e => e.message! : e => voca.trimRight(e.message!, '\r\n');

      let separator: (lineBreak: string) => string = (lineBreak) => {
        switch (lineBreak) {
          case LineBreak.LF:
            return '\n';
          case LineBreak.CRLF:
            return '\r\n';
          case LineBreak.NO_MODIFICATION:
          default:
            return '';
        }
      };

      let sep = separator(settings.lineBreak);
      let messages = data.events
        .filter(e => e.message != null)
        .map(trimmer)
        .join(sep);

      out.write(messages);
      out.write(sep);
    };

    // callback for end processing.
    let callbackEnd = (err: AWS.AWSError) => {
      out.end();
      dispatch(errorLogEvents(id));
    };

    // callback for handling errors.
    let callbackError = () => {
      out.end();
      dispatch(receiveLogEvents(id));
    };

    getCloudWatchLogsEvents(
      callbackData,
      callbackEnd,
      callbackError,
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
