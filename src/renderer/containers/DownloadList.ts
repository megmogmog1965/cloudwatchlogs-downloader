// src/containers/DownloadList.ts

import DownloadList from '../components/DownloadList';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import * as types from '../common-interfaces';

interface Props {
  settings: types.Settings;
  jobs: types.DownloadJob[];
}

export function mapStateToProps({ settings, logEvents }: StoreState): Props {
  // descending order.
  let allJobs = logEvents.runningJobs
    .concat(logEvents.finishedJobs, logEvents.errorJobs)
    .sort((a, b) => b.startTime - a.startTime);

  return {
    settings: settings.settings,
    jobs: allJobs,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.SettingsAction>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadList);
