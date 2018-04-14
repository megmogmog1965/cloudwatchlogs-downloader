// src/containers/Settings.ts

import Settings from '../components/Settings';
import * as actions from '../actions/';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import * as types from '../common-interfaces/Settings';
import { save } from '../side-effect-functions';

interface Props {
  initialValues: types.Settings;
}

export function mapStateToProps({ settings }: StoreState): Props {
  return {
    initialValues: {
      region: settings.settings.region,
      awsAccessKeyId: settings.settings.awsAccessKeyId,
      awsSecretAccessKey: settings.settings.awsSecretAccessKey,
      lineBreak: settings.settings.lineBreak,
    },
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.SettingsAction>) {
  return {
    onSubmit: (values: types.Settings) => dispatch(
      actions.saveSettings(
        {
          region: values.region,
          awsAccessKeyId: values.awsAccessKeyId,
          awsSecretAccessKey: values.awsSecretAccessKey,
          lineBreak: values.lineBreak,
        },
        new Date(),
        save),
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
