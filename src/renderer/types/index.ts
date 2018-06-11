// src/types/index.tsx

import * as enums from '../enums';
import { Region, LineBreak } from '../constants';
import { LogGroup, LogStream, Settings, DownloadJob } from '../common-interfaces';

export interface StoreState {
  window: WindowState;
  logGroups: LogGroupsState;
  logStreams: LogStreamsState;
  logText: LogTextState;
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

export interface LogTextState {
  text: string;
}

export interface LogEventsState {
  runningJobs: DownloadJob[];
  finishedJobs: DownloadJob[];
  errorJobs: DownloadJob[];
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
  logText: {
    text: '',
  },
  logEvents: {
    runningJobs: [
      { id: 'xxxx', logGroupName: 'Log group 3', logStreamName: 'Log stream 3', startTime: 0, progress: 0.3 },
      { id: 'xxxx', logGroupName: 'Log group 2', logStreamName: 'Log stream 2', startTime: 0, progress: 0.7 },
    ],
    finishedJobs: [
      { id: 'xxxx', logGroupName: 'Log group 1', logStreamName: 'Log stream 1', startTime: 0, progress: 1.0 },
    ],
    errorJobs: [],
  },
  settings: {
    settings: {
      region: Region.AP_NORTHEAST_1,
      awsAccessKeyId: '',
      awsSecretAccessKey: '',
      lineBreak: LineBreak.LF,
      jsonKey: '',
    },
    lastModified: new Date(0),
  },
  dateRange: {
    startDate: new Date(),
    endDate: new Date(new Date().getTime() - 60 * 60 * 1000),
  },
};
