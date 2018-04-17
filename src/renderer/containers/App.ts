// src/containers/App.ts

import { shell } from 'electron';
import * as enums from '../enums';
import App from '../components/App';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { load, currentDate, getCloudWatchLogGroups, getCloudWatchLogStreams } from '../side-effect-functions';
import { LogGroup, LogStream } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';

export function mapStateToProps({ window, settings, logGroups, logStreams, logEvents }: StoreState) {
  return {
    windowContent: window.windowContent,
    settings: settings.settings,
    logGroupName: logGroups.selectedName,
    logStreamName: logStreams.selectedName,
    runningIds: logEvents.runningIds,
    errorIds: logEvents.errorIds,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.WindowAction>) {
  return {
    ShowWindowContent: (windowContent: enums.WindowContent) => dispatch(actions.showWindowContent(windowContent)),
    LoadSettings: () => dispatch(actions.loadSettings(load, currentDate)),
    ReloadAll: (settings: Settings, logGroupName?: string, logStreamName?: string) => reloadAll(dispatch, settings, logGroupName, logStreamName),
    OpenGithub: () => shell.openExternal('https://github.com/megmogmog1965/cloudwatchlogs-downloader'),
  };
}

function reloadAll(
  dispatch: Dispatch<actions.WindowAction>,
  settings: Settings,
  logGroupName?: string,
  logStreamName?: string) {

  // fetch log groups.
  dispatch(actions.fetchLogGroups(
    settings,
    (
      callbackStart: (time: Date) => void,
      callbackError: (time: Date, err: AWS.AWSError) => void,
      callbackEnd: (time: Date, logGroups: LogGroup[]) => void,
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
      callbackEnd: (time: Date, logStreams: LogStream[]) => void,
    ) => getCloudWatchLogStreams(settings, logGroupName, callbackStart, callbackError, callbackEnd), // currying.
  ));
}

export default connect(mapStateToProps, mapDispatchToProps)(App as any);
