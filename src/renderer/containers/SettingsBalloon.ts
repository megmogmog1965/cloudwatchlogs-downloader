// src/containers/SettingsBalloon.ts

import Balloon from '../components/Balloon';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import * as enums from '../enums';

interface Props {
  visible: boolean;
  message: string;
}

export function mapStateToProps({ settings, window }: StoreState): Props {
  return {
    visible: window.windowContent !== enums.WindowContent.Settings
      && (settings.settings.awsSecretAccessKey.length === 0 || settings.settings.awsAccessKeyId.length === 0),
    message: 'Fill me !',
  };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Balloon);
