// src/containers/LogContent.ts

import LogContent from '../components/LogContent';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { Settings, DownloadJob } from '../common-interfaces';
import { mergeFilters } from '../utils';
import { createUuid, currentDate, connectCloudWatchLogs, getCloudWatchLogsEvents, showSaveDialog } from '../side-effect-functions';

export function mapStateToProps({ logGroups, logStreams, dateRange, settings, logText }: StoreState) {
  return {
    settings: settings.settings,
    logGroupName: logGroups.selectedName,
    logStreamName: logStreams.selectedName,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    logText: logText.text,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.LogGroupAction>) {
  return {
    SetDateRange: (startDate: Date, endDate: Date) => dispatch(actions.setDateRange(startDate, endDate)),
    DownloadLogs: (settings: Settings, logGroupName: string, logStreamName: string, startDate: Date, endDate: Date) => {
      // how to filter logs ?
      let filter = mergeFilters(settings.filters);

      // create a job.
      let job: DownloadJob = {
        id: createUuid(),
        logGroupName: logGroupName,
        logStreamName: logStreamName,
        startTime: currentDate().getTime(),
        progress: 0,
      };

      dispatch(actions.downloadLogs(
        settings,
        () => showSaveDialog(logStreamName),
        job,
        (
          callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse, progress: number) => void,
          callbackError: (err: AWS.AWSError) => void,
          callbackEnd: () => void,
        ) => getCloudWatchLogsEvents(connectCloudWatchLogs(settings), logGroupName, logStreamName, startDate, endDate, callbackData, callbackError, callbackEnd), // currying.
        filter,
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogContent as any);
