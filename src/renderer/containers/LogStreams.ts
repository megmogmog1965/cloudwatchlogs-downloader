// src/containers/LogStreams.ts

import LogStreams from '../components/LogStreams';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { currentDate } from '../side-effect-functions';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ logStreams, settings }: StoreState) {
  return {
    logStreams: logStreams.logStreams,
    selectedName: logStreams.selectedName,
    lastModified: logStreams.lastModified,
    settings: settings.settings,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.LogGroupAction>) {
  return {
    SelectLogStream: (selectedName: string) => dispatch(actions.selectLogStream(selectedName)),
    Now: currentDate,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogStreams as any);
