// src/containers/LogStreams.ts

import LogStreams from '../components/LogStreams';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { currentDate, getCloudWatchLogsEvents } from '../side-effect-functions';
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
    },
    Now: currentDate,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogStreams as any);
