import * as React from 'react';
import './App.css';
import * as enums from '../enums';
import store from '../Store';
import LogStreams from '../containers/LogStreams';
import LogGroups from '../containers/LogGroups';
import LogContent from '../containers/LogContent';
import Settings from '../containers/Settings';
import { Provider } from 'react-redux';
import * as types from '../common-interfaces/Settings';

export interface Props {
  windowContent: enums.WindowContent;
  settings: types.Settings;
  logGroupName: string;
  logStreamName: string;
  ShowWindowContent: (windowContent: enums.WindowContent) => void;
  LoadSettings: () => void;
  ReloadAll: (settings: types.Settings, logGroupName?: string, logStreamName?: string) => void;
  OpenGithub: () => void;
}

class App extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
  }

  componentDidMount(): void {
    this.props.LoadSettings();
  }

  render() {
    let props = this.props;

    return (
      <div className="App window">
        <header className="toolbar toolbar-header">

          <div className="toolbar-actions">
            <div className="btn-group">
              <button className={'btn btn-default ' + buttonState(enums.WindowContent.LogDownload, props.windowContent)} onClick={() => props.ShowWindowContent(enums.WindowContent.LogDownload)}>
                <span className="icon icon-install icon-text" />Download Logs
              </button>
              <button className={'btn btn-default ' + buttonState(enums.WindowContent.Settings, props.windowContent)} onClick={() => props.ShowWindowContent(enums.WindowContent.Settings)}>
                <span className="icon icon-cog icon-text" />Settings
              </button>
            </div>

            <button className="btn btn-default" onClick={() => props.ReloadAll(props.settings, props.logGroupName, props.logStreamName)}>
              <span className="icon icon-arrows-ccw icon-text" />Reload
          </button>

            <button className="btn btn-default pull-right" onClick={this.props.OpenGithub}>
              <span className="icon icon-github" />
            </button>
          </div>
        </header>

        <div className="window-content">
          {createWindowContent(props.windowContent)}
        </div>
      </div>
    );
  }
}

function buttonState(target: enums.WindowContent, current: enums.WindowContent): string {
  return target === current ? 'active' : '';
}

function createWindowContent(windowContent: enums.WindowContent) {
  switch (windowContent) {
    case enums.WindowContent.LogDownload:
      return (
        <div className="pane-group">
          <div className="pane pane-group">
            <div className="pane">
              <Provider store={store}>
                <LogGroups />
              </Provider>
            </div>
            <div className="pane">
              <Provider store={store}>
                <LogStreams />
              </Provider>
            </div>
          </div>
          <div className="pane">
            <Provider store={store}>
              <LogContent />
            </Provider>
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
