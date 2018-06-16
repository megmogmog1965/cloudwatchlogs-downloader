// src/containers/LogStreams.ts

import LogStreams from '../components/LogStreams';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { currentDate, connectCloudWatchLogs, getCloudWatchLogsEvents } from '../side-effect-functions';
import { Settings, LogStream } from '../common-interfaces';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ logStreams, settings, logGroups }: StoreState) {
  return {
    logStreams: logStreams.logStreams,
    selectedName: logStreams.selectedName,
    lastModified: logStreams.lastModified,
    settings: settings.settings,
    logGroupName: logGroups.selectedName,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.LogGroupAction>) {
  return {
    SelectLogStream: (selectedName: string) => dispatch(actions.selectLogStream(selectedName)),
    FetchLogText: (settings: Settings, logGroupName: string, logStream: LogStream) => {
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
    },
    Now: currentDate,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogStreams as any);
