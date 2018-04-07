import { ActionTypes } from '../constants';
import * as enums from '../enums';
import { Dispatch } from 'redux';
import * as AWS from 'aws-sdk';
import { LogGroup } from '../common-interfaces/Aws';
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
  selectedArn: string;
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

export function fetchLogGroups(settings: Settings): any {
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
        .map(g => ({
          arn: g.arn!,
          logGroupName: g.logGroupName!,
          creationTime: g.creationTime,
          storedBytes: g.storedBytes
        }));

      dispatch(receiveLogGroups(groups, now));
    });
  };
}

export function selectLogGroup(selectedArn: string): SelectLogGroup {
  return {
    type: ActionTypes.SELECT_LOG_GROUP,
    selectedArn: selectedArn,
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
