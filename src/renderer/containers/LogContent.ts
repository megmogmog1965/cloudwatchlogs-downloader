// src/containers/LogContent.ts

import LogContent from '../components/LogContent';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { Settings, DownloadJob, Transform } from '../common-interfaces';
import { TransformTypes } from '../constants';
import { extractJson } from '../utils';
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
      // how to transform logs ?
      let transformer = createTransformer(settings.filters);

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
        transformer,
      ));
    },
  };
}

function createTransformer(filters: Transform[])
  : (line: string) => string {

  let filterFunctions = filters.map(f => {
      switch (f.type) {
        case TransformTypes.REPLACE_REGEX:
          let regex = new RegExp(f.pattern, 'm');
          return (line: string) => line.replace(regex, f.replacement);
        case TransformTypes.EXTRACT_JSON:
          return (line: string) => extractJson(line, f.key);
        default:
          throw new Error('error detected, invalid filter type.');
      }
    });

  return filterFunctions.reduce(
    (pre, cur) => (line: string) => cur(pre(line)),
    (line: string) => line,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LogContent as any);
