// src/containers/LogContent.ts

import LogContent from '../components/LogContent';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { Settings } from '../common-interfaces/Settings';
import { createUuid, getCloudWatchLogsEvents, showSaveDialog } from '../side-effect-functions';

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
      dispatch(actions.downloadLogs(
        settings,
        showSaveDialog,
        createUuid,
        (
          callbackData: (data: AWS.CloudWatchLogs.Types.GetLogEventsResponse) => void,
          callbackError: (err: AWS.AWSError) => void,
          callbackEnd: () => void,
        ) => getCloudWatchLogsEvents(settings, logGroupName, logStreamName, startDate, endDate, callbackData, callbackError, callbackEnd), // currying.
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogContent as any);
