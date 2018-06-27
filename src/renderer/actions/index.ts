import { ActionTypes, LineBreak } from '../constants';
import * as enums from '../enums';
import { Dispatch } from 'redux';
import * as AWS from 'aws-sdk';
import * as stream from 'stream';
import { LogGroup, LogStream, Settings, DownloadJob } from '../common-interfaces';
import { safeFilter } from '../utils';
import voca from 'voca';

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

export interface RequestLogText {
  type: ActionTypes.REQUEST_LOG_TEXT;
}

export interface ReceiveLogText {
  type: ActionTypes.RECEIVE_LOG_TEXT;
  text: string;
}

export interface ErrorLogText {
  type: ActionTypes.ERROR_LOG_TEXT;
  errorMessage: string;
}

export interface RequestLogEvents {
  type: ActionTypes.REQUEST_LOG_EVENTS;
  job: DownloadJob;
}

export interface ProgressLogEvents {
  type: ActionTypes.PROGRESS_LOG_EVENTS;
  job: DownloadJob;
}

export interface ReceiveLogEvents {
  type: ActionTypes.RECEIVE_LOG_EVENTS;
  job: DownloadJob;
}

export interface ErrorLogEvents {
  type: ActionTypes.ERROR_LOG_EVENTS;
  job: DownloadJob;
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

export type LogTextAction = RequestLogText | ReceiveLogText | ErrorLogText;

export type LogEventAction = RequestLogEvents | ProgressLogEvents | ReceiveLogEvents | ErrorLogEvents;

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

const trimmer: (settings: Settings) => (line: string) => string
  = (settings) => (settings.lineBreak === LineBreak.NO_MODIFICATION) ?
    line => line : line => voca.trimRight(line, '\r\n');

const separator: (lineBreak: string) => string = (lineBreak) => {
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

export function requestLogText(): RequestLogText {
  return {
    type: ActionTypes.REQUEST_LOG_TEXT,
  };
}

export function receiveLogText(text: string): ReceiveLogText {
  return {
    type: ActionTypes.RECEIVE_LOG_TEXT,
    text,
  };
}

export function errorLogText(errorMessage: string): ErrorLogText {
  return {
    type: ActionTypes.ERROR_LOG_TEXT,
    errorMessage,
  };
}

export function fetchLogText(
  settings: Settings,
  getCloudWatchLogsEvents: (
    callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
    callbackError: (err: AWS.AWSError) => void,
    callbackEnd: () => void,
  ) => void,
): (dispatch: Dispatch<LogGroupAction>) => void {

  let logs = '';

  return (dispatch: Dispatch<LogGroupAction>) => {
    // start fetching.
    dispatch(requestLogText());

    // callback for receive log chunks.
    let callbackData = (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => {
      if (!data.events) {
        return;
      }

      let sep = separator(settings.lineBreak);
      let messages = data.events
        .filter(e => e.message != null)
        .map(e => e.message!)
        .map(trimmer(settings))
        .join(sep);

      logs = logs + messages + sep;
    };

    // callback for end processing.
    let callbackError = (err: AWS.AWSError) => dispatch(errorLogText(err.message));

    // callback for handling errors.
    let callbackEnd = () => dispatch(receiveLogText(logs));

    getCloudWatchLogsEvents(
      callbackData,
      callbackError,
      callbackEnd,
    );
  };
}

export function requestLogEvents(job: DownloadJob): RequestLogEvents {
  return {
    type: ActionTypes.REQUEST_LOG_EVENTS,
    job,
  };
}

export function progressLogEvents(job: DownloadJob): ProgressLogEvents {
  return {
    type: ActionTypes.PROGRESS_LOG_EVENTS,
    job,
  };
}

export function receiveLogEvents(job: DownloadJob): ReceiveLogEvents {
  return {
    type: ActionTypes.RECEIVE_LOG_EVENTS,
    job,
  };
}

export function errorLogEvents(job: DownloadJob): ErrorLogEvents {
  return {
    type: ActionTypes.ERROR_LOG_EVENTS,
    job,
  };
}

export function downloadLogs(
  settings: Settings,
  fileChooser: () => stream.Writable | undefined,
  job: DownloadJob,
  getCloudWatchLogsEvents: (
    callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
    callbackError: (err: AWS.AWSError) => void,
    callbackEnd: () => void,
  ) => void,
  filter: (line: string) => string | undefined = (line: string) => line,
): (dispatch: Dispatch<LogGroupAction>) => void {

  return (dispatch: Dispatch<LogGroupAction>) => {
    // it returns a file that user choosed.
    let choosed = fileChooser();
    if (!choosed) {
      return; // "cancel" chosen.
    }
    const out = choosed;

    // accept the job.
    dispatch(requestLogEvents(job));

    // callback for receive log chunks.
    let callbackData = (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => {
      if (!data.events) {
        return;
      }

      let sep = separator(settings.lineBreak);
      let messages = data.events
        .filter(e => e.message != null)
        .map(e => e.message!)
        .map(safeFilter(filter))
        .filter(e => e !== undefined)
        .map(trimmer(settings))
        .join(sep);

      out.write(messages);
      out.write(sep);

      job = { ...job, progress: progress };
      dispatch(progressLogEvents(job));
    };

    // callback for handling errors.
    let callbackError = (err: AWS.AWSError) => {
      out.end();
      dispatch(errorLogEvents(job));
    };

    // callback for end processing.
    let callbackEnd = () => {
      out.end();
      job = { ...job, progress: 1.0 };
      dispatch(receiveLogEvents(job));
    };

    getCloudWatchLogsEvents(
      callbackData,
      callbackError,
      callbackEnd,
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

export function loadSettings(
  load: () => Promise<Settings>,
  now: () => Date,
): (dispatch: Dispatch<LogGroupAction>) => void {

  return (dispatch: Dispatch<LogGroupAction>) => {
    load().then((settings: Settings) => {
      dispatch(receiveSettings(settings, now()));
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
