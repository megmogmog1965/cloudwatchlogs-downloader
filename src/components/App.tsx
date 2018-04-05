import * as React from 'react';
import './App.css';
import * as enums from '../enums';
import store from '../Store';
import LogStreams from '../components/LogStreams';
import LogGroups from '../containers/LogGroups';
import Settings from '../containers/Settings';
import { Provider } from 'react-redux';

export interface Props {
  windowContent: enums.WindowContent;
  ShowWindowContent: (windowContent: enums.WindowContent) => void;
}

function App({ windowContent, ShowWindowContent }: Props) {
  return (
    <div className="App window">
      <header className="toolbar toolbar-header">

        <div className="toolbar-actions">
          <div className="btn-group">
            <button className={'btn btn-default ' + buttonState(enums.WindowContent.LogDownload, windowContent)} onClick={() => ShowWindowContent(enums.WindowContent.LogDownload)}>
              <span className="icon icon-install" />
            </button>
            <button className={'btn btn-default ' + buttonState(enums.WindowContent.Settings, windowContent)} onClick={() => ShowWindowContent(enums.WindowContent.Settings)}>
              <span className="icon icon-cog" />
            </button>
          </div>

          <button className="btn btn-default">
            <span className="icon icon-home icon-text" />Filters
          </button>

          <button className="btn btn-default btn-dropdown pull-right">
            <span className="icon icon-megaphone" />
          </button>
        </div>
      </header>

      <div className="window-content">
        {createWindowContent(windowContent)}
      </div>
    </div>
  );
}

function buttonState(target: enums.WindowContent, current: enums.WindowContent): string {
  return target === current ? 'active' : '';
}

function createWindowContent(windowContent: enums.WindowContent) {
  switch (windowContent) {
    case enums.WindowContent.LogDownload:
      return (
        <div className="pane-group">
          <div className="pane-sm sidebar">
            <Provider store={store}>
              <LogGroups />
            </Provider>
          </div>
          <div className="pane">
            <LogStreams />
          </div>
        </div>
      );
    case enums.WindowContent.Settings:
      return (
        <Provider store={store}>
          <Settings />
        </Provider>
      );
    default:
      throw new Error('Undefined WindowContent: ' + windowContent);
  }
}

export default App;
