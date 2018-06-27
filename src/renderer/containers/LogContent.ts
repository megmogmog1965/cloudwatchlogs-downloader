// src/containers/LogContent.ts

import LogContent from '../components/LogContent';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { Settings, DownloadJob, Filter } from '../common-interfaces';
import { FilterTypes } from '../constants';
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
      // how to filter logs ?
      let filter = createFilter(settings.filters);

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

function createFilter(filters: Filter[])
  : (line: string) => string | undefined {

  // create filter functions from filter types.
  let funcs = filters.map(f => {
    switch (f.type) {
      case FilterTypes.FILTER_REGEX:
        return (line: string) => new RegExp(f.pattern, 'm').test(line) ? line : undefined;
      case FilterTypes.REPLACE_REGEX:
        return (line: string) => line.replace(new RegExp(f.pattern, 'm'), f.replacement);
      case FilterTypes.EXTRACT_JSON:
        return (line: string) => extractJson(line, f.key);
      default:
        throw new Error('error detected, invalid filter type.');
    }
  });

  // merge all filter functions to be called orderly.
  return funcs.reduce(
    (pre, cur) => (line: string) => {
      let evaluated = pre(line);
      return evaluated !== undefined ? cur(evaluated) : undefined;
    },
    (line: string) => line,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LogContent as any);
