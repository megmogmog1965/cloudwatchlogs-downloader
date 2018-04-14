import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as enums from '../enums';
import * as types from '../common-interfaces/Settings';

let settings: types.Settings = {
  region: '',
  awsAccessKeyId: '',
  awsSecretAccessKey: '',
  lineBreak: 'LF',
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  let props = {
    windowContent: enums.WindowContent.LogDownload,
    settings: settings,
    logGroupName: '',
    logStreamName: '',
    ShowWindowContent: (windowContent: any) => windowContent,
    LoadSettings: () => 0,
    ReloadAll: () => 0,
    OpenGithub: () => 0,
  };

  ReactDOM.render(<App {...props} />, div);
});
