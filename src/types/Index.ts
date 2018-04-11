// src/types/index.tsx

import * as enums from '../enums';
import { Region } from '../constants';
import { LogGroup, LogStream } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';

export interface StoreState {
  window: WindowState;
  logGroups: LogGroupsState;
  logStreams: LogStreamsState;
  logEvents: LogEventsState;
  dateRange: DateRangeState;
  settings: SettingsState;
}

export interface WindowState {
  windowContent: enums.WindowContent;
}

export interface LogGroupsState {
  logGroups: LogGroup[];
  selectedName?: string;
  errorMessage?: string;
  lastModified: Date;
}

export interface LogStreamsState {
  logStreams: LogStream[];
  selectedName?: string;
  errorMessage?: string;
  lastModified: Date;
}

export interface LogEventsState {
  runningIds: string[];
  finishedIds: string[];
  errorIds: string[];
}

export interface SettingsState {
  settings: Settings;
  lastModified: Date;
}

export interface DateRangeState {
  startDate: Date;
  endDate: Date;
}

export const initialState: StoreState = {
  window: {
    windowContent: enums.WindowContent.LogDownload,
  },
  logGroups: {
    logGroups: [],
    lastModified: new Date(0),
  },
  logStreams: {
    logStreams: [],
    lastModified: new Date(0),
  },
  logEvents: {
    runningIds: [],
    finishedIds: [],
    errorIds: [],
  },
  settings: {
    settings: {
      region: Region.AP_NORTHEAST_1,
      awsAccessKeyId: '',
      awsSecretAccessKey: '',
    },
    lastModified: new Date(0),
  },
  dateRange: {
    startDate: new Date(),
    endDate: new Date(new Date().getTime() - 60 * 60 * 1000),
  },
};
