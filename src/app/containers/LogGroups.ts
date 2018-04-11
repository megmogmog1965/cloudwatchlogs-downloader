// src/containers/LogGroups.ts

import LogGroups from '../components/LogGroups';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { Settings } from '../common-interfaces/Settings';

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
    FetchLogGroups: (settings: Settings) => dispatch(actions.fetchLogGroups(settings)),
    SelectLogGroup: (selectedName: string) => dispatch(actions.selectLogGroup(selectedName)),
    FetchLogStreams: (settings: Settings, logGroupName: string) => dispatch(actions.fetchLogStreams(settings, logGroupName)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogGroups as any);
