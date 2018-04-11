// src/containers/App.ts

import { shell } from 'electron';
import * as enums from '../enums';
import App from '../components/App';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { load } from '../side-effect-functions';
import { Settings } from '../common-interfaces/Settings';

// declare variables for external modules.
// declare var shell: any;

export function mapStateToProps({ window, settings, logGroups, logStreams }: StoreState) {
  return {
    windowContent: window.windowContent,
    settings: settings.settings,
    logGroupName: logGroups.selectedName,
    logStreamName: logStreams.selectedName,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.WindowAction>) {
  return {
    ShowWindowContent: (windowContent: enums.WindowContent) => dispatch(actions.showWindowContent(windowContent)),
    LoadSettings: () => dispatch(actions.loadSettings(load)),
    ReloadAll: (settings: Settings, logGroupName?: string, logStreamName?: string) => dispatch(actions.reloadAll(settings, logGroupName, logStreamName)),
    OpenGithub: () => shell.openExternal('https://github.com/megmogmog1965/cloudwatchlogs-downloader'),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App as any);
