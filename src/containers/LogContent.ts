// src/containers/LogContent.ts

import LogContent from '../components/LogContent';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ logGroups, logStreams, dateRange, settings }: StoreState) {
  return {
    settings: settings.settings,
    logGroupName: logStreams.selectedName,
    logStreamName: logStreams.selectedName,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.LogGroupAction>) {
  return {
    SetDateRange: (startDate: Date, endDate: Date) => dispatch(actions.setDateRange(startDate, endDate)),
    DownloadLogs: (logGroupName: string, logStreamName: string, startDate: Date, endDate: Date) => dispatch(<any> {}),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(<any> LogContent);
