// src/containers/LogGroups.ts

import LogGroups from '../components/LogGroups';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { LogGroup, LogStream } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';
import { getCloudWatchLogGroups, getCloudWatchLogStreams } from '../side-effect-functions';

export function mapStateToProps({ logGroups, settings }: StoreState) {
  return {
    logGroups: logGroups.logGroups,
    selectedName: logGroups.selectedName,
    lastModified: logGroups.lastModified,
    settings: settings.settings,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.LogGroupAction>) {
  return {
    FetchLogGroups: (settings: Settings) => dispatch(actions.fetchLogGroups(
      settings,
      (
        callbackStart: (time: Date) => void,
        callbackError: (time: Date, err: AWS.AWSError) => void,
        callbackEnd: (time: Date, logGroups: LogGroup[]) => void,
      ) => getCloudWatchLogGroups(settings, callbackStart, callbackError, callbackEnd), // currying.
    )),
    SelectLogGroup: (selectedName: string) => dispatch(actions.selectLogGroup(selectedName)),
    FetchLogStreams: (settings: Settings, logGroupName: string) => dispatch(actions.fetchLogStreams(
      settings,
      logGroupName,
      (
        callbackStart: (time: Date) => void,
        callbackError: (time: Date, err: AWS.AWSError) => void,
        callbackEnd: (time: Date, logStreams: LogStream[]) => void,
      ) => getCloudWatchLogStreams(settings, logGroupName, callbackStart, callbackError, callbackEnd), // currying.
    )),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogGroups as any);
