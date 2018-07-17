// src/containers/App.ts

import { shell } from 'electron';
import * as enums from '../enums';
import App from '../components/App';
import LoadingOverlay from '../containers/LoadingOverlay';
import ModalPopup from '../containers/ModalPopup';
import LogGroups from '../containers/LogGroups';
import LogStreams from '../containers/LogStreams';
import LogContent from '../containers/LogContent';
import Filters from '../containers/Filters';
import Settings from '../containers/Settings';
import DownloadList from '../containers/DownloadList';
import DownloadBadge from '../containers/DownloadBadge';
import SettingsBalloon from '../containers/SettingsBalloon';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { load, currentDate, connectCloudWatchLogs, getCloudWatchLogGroups, getCloudWatchLogStreams, getCloudWatchLogsEvents } from '../side-effect-functions';
import * as types from '../common-interfaces';

export function mapStateToProps({ window, settings, logGroups, logStreams, logEvents }: StoreState) {
  return {
    LoadingOverlay: LoadingOverlay,
    ModalPopup: ModalPopup,
    LogGroups: LogGroups,
    LogStreams: LogStreams,
    LogContent: LogContent,
    Filters: Filters,
    Settings: Settings,
    DownloadList: DownloadList,
    DownloadBadge: DownloadBadge,
    SettingsBalloon: SettingsBalloon,
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
    ) => getCloudWatchLogGroups(connectCloudWatchLogs(settings), callbackStart, callbackError, callbackEnd), // currying.
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
    ) => getCloudWatchLogStreams(connectCloudWatchLogs(settings), logGroupName, callbackStart, callbackError, callbackEnd), // currying.
  ));

  if (!logStream) {
    return;
  }

  const margin = 5 * 60 * 1000; // "start" timestamp can be same value with "end". It cause getting empty logs.
  const endDate = new Date(logStream.lastEventTimestamp + margin);
  const startDate = new Date(logStream.firstEventTimestamp - margin);
  const limit = 20; // fetch few lines.

  dispatch(actions.fetchLogText(
    settings,
    (
      callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
      callbackError: (err: AWS.AWSError) => void,
      callbackEnd: () => void,
    ) => getCloudWatchLogsEvents(connectCloudWatchLogs(settings), logGroupName, logStream.logStreamName, startDate, endDate, callbackData, callbackError, callbackEnd, false, limit), // currying.
  ));
}

export default connect(mapStateToProps, mapDispatchToProps)(App as any);
