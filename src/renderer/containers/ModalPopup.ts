// src/containers/ModalPopup.ts

import ModalPopup from '../components/ModalPopup';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';

interface Props {
  message: string;
  subMessage?: string;
  visible: boolean;
}

export function mapStateToProps({ message }: StoreState): Props {
  return {
    message: message.message,
    subMessage: message.subMessage,
    visible: message.visible,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.SettingsAction>) {
  return {
    HideMessage: () => dispatch(actions.hideMessage()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalPopup as any);
