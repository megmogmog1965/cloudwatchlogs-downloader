// src/containers/LogGroups.ts

import LogGroups from '../components/LogGroups';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ logGroups, settings }: StoreState) {
  return {
    logGroups: logGroups.logGroups,
    selectedArn: logGroups.selectedArn,
    settings: settings.settings,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.LogGroupAction>) {
  return {
    SelectLogGroup: (selectedArn: string) => dispatch(actions.selectLogGroup(selectedArn)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(<any> LogGroups);
