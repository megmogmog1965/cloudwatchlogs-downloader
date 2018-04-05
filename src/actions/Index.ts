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
  errorMessage?: string;
}

export interface SelectLogGroup {
  type: ActionTypes.SELECT_LOG_GROUP;
  selectedArn: string;
}

export interface SaveSettings {
  type: ActionTypes.SAVE_SETTINGS;
  settings: Settings;
}

export interface ReceiveSettings {
  type: ActionTypes.RECEIVE_SETTINGS;
  settings: Settings;
}

//////////// Action types ////////////

export type WindowAction = ShowWindowContent;

export type LogGroupAction = RequestLogGroups | ReceiveLogGroups | SelectLogGroup;

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

export function receiveLogGroups(logGroups: LogGroup[], errorMessage?: string): ReceiveLogGroups {
  return {
    type: ActionTypes.RECEIVE_LOG_GROUPS,
    logGroups: logGroups,
    errorMessage: errorMessage,
  };
}

export function fetchLogGroups(settings: Settings): any {
  return (dispatch: Dispatch<LogGroupAction>) => {

    const cloudwatchlogs = new AWS.CloudWatchLogs({
      region: settings.region,
      accessKeyId: settings.awsAccessKeyId,
      secretAccessKey: settings.awsSecretAccessKey,
    });

    var result = cloudwatchlogs.describeLogGroups({}, (err, data) => {
      if (err) {
        dispatch(receiveLogGroups([], err.message));
        return;
      }

      if (!data.logGroups) {
        dispatch(receiveLogGroups([]));
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
      groups.filter(g => g != null);

      dispatch(receiveLogGroups(groups));
    });

    return result;
  };
}

export function selectLogGroup(selectedArn: string): SelectLogGroup {
  return {
    type: ActionTypes.SELECT_LOG_GROUP,
    selectedArn: selectedArn,
  };
}

export function saveSettings(settings: Settings, save: (settings: Settings) => void): SaveSettings {
  // save settings to app local.
  save(settings);

  return {
    type: ActionTypes.SAVE_SETTINGS,
    settings: settings,
  };
}

export function loadSettings(load: () => Promise<Settings>) {
  return (dispatch: Dispatch<LogGroupAction>) => {
    load().then((settings: Settings) => {
      dispatch(receiveSettings(settings));
    });
  };
}

export function receiveSettings(settings: Settings): ReceiveSettings {
  return {
    type: ActionTypes.RECEIVE_SETTINGS,
    settings: settings,
  };
}
