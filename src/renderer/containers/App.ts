// src/containers/App.ts

import { shell } from 'electron';
import * as enums from '../enums';
import App from '../components/App';
import LogGroups from '../containers/LogGroups';
import LogStreams from '../containers/LogStreams';
import LogContent from '../containers/LogContent';
import Settings from '../containers/Settings';
import DownloadList from '../containers/DownloadList';
import DownloadBadge from '../containers/DownloadBadge';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { load, currentDate, getCloudWatchLogGroups, getCloudWatchLogStreams, getCloudWatchLogsEvents } from '../side-effect-functions';
import * as types from '../common-interfaces';

export function mapStateToProps({ window, settings, logGroups, logStreams, logEvents }: StoreState) {
  return {
    LogGroups: LogGroups,
    LogStreams: LogStreams,
    LogContent: LogContent,
    Settings: Settings,
    DownloadList: DownloadList,
    DownloadBadge: DownloadBadge,
    windowContent: window.windowContent,
    settings: settings.settings,
    logGroupName: logGroups.selectedName,
    logStream: logStreams.logStreams.find(s => s.logStreamName === logStreams.selectedName),
    runningJobs: logEvents.runningJobs,
    errorJobs: logEvents.errorJobs,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.WindowAction>) {
  return {
    ShowWindowContent: (windowContent: enums.WindowContent) => dispatch(actions.showWindowContent(windowContent)),
    LoadSettings: () => dispatch(actions.loadSettings(load, currentDate)),
    ReloadAll: (settings: types.Settings, logGroupName?: string, logStream?: types.LogStream) => reloadAll(dispatch, settings, logGroupName, logStream),
    OpenGithub: () => shell.openExternal('https://github.com/megmogmog1965/cloudwatchlogs-downloader'),
  };
}

function reloadAll(
  dispatch: Dispatch<actions.WindowAction>,
  settings: types.Settings,
  logGroupName?: string,
  logStream?: types.LogStream) {

  // fetch log groups.
  dispatch(actions.fetchLogGroups(
    settings,
    (
      callbackStart: (time: Date) => void,
      callbackError: (time: Date, err: AWS.AWSError) => void,
      callbackEnd: (time: Date, logGroups: types.LogGroup[]) => void,
    ) => getCloudWatchLogGroups(settings, callbackStart, callbackError, callbackEnd), // currying.
  ));

  if (!logGroupName) {
    return;
  }

  // fetch log streams.
  dispatch(actions.fetchLogStreams(
    settings,
    logGroupName,
    (
      callbackStart: (time: Date) => void,
      callbackError: (time: Date, err: AWS.AWSError) => void,
      callbackEnd: (time: Date, logStreams: types.LogStream[]) => void,
    ) => getCloudWatchLogStreams(settings, logGroupName, callbackStart, callbackError, callbackEnd), // currying.
  ));

  if (!logStream) {
    return;
  }

  const endDate = new Date(logStream.lastEventTimestamp);
  const startDate = new Date(logStream.firstEventTimestamp);
  const limit = 20; // fetch few lines.

  dispatch(actions.fetchLogText(
    settings,
    (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => getCloudWatchLogsEvents(settings, logGroupName, logStream.logStreamName, startDate, endDate, callbackData, callbackError, callbackEnd, false, limit), // currying.
  ));
}

export default connect(mapStateToProps, mapDispatchToProps)(App as any);
