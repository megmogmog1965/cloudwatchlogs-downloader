// src/containers/DownloadList.ts

import DownloadList from '../components/DownloadList';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import * as types from '../common-interfaces';

interface Props {
  settings: types.Settings;
}

export function mapStateToProps({ settings }: StoreState): Props {
  return {
    settings: settings.settings,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.SettingsAction>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadList);
