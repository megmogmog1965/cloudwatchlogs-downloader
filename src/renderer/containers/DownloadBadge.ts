// src/containers/DownloadBadge.ts

import DownloadBadge from '../components/DownloadBadge';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import * as types from '../common-interfaces';

interface Props {
  jobs: types.DownloadJob[];
}

export function mapStateToProps({ logEvents }: StoreState): Props {
  // descending order.
  let allJobs = logEvents.runningJobs
    .concat(logEvents.finishedJobs, logEvents.errorJobs)
    .sort((a, b) => b.startTime - a.startTime);

  return {
    jobs: allJobs,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.SettingsAction>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadBadge);
