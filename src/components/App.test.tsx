import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as enums from '../enums';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App windowContent={enums.WindowContent.LogDownload} ShowWindowContent={(windowContent) => windowContent} LoadSettings={() => 0} />, div);
});
