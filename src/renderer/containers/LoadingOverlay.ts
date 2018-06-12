// src/containers/LoadingOverlay.ts

import LoadingOverlay from '../components/LoadingOverlay';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';

interface Props {
  visible: boolean;
}

export function mapStateToProps({ asyncCalls }: StoreState): Props {
  return {
    visible: asyncCalls.active > 0,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.SettingsAction>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingOverlay);
