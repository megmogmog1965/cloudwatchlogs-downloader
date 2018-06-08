import * as React from 'react';
import './App.css';
import * as enums from '../enums';
import Progress from '../components/Progress';
import * as types from '../common-interfaces';

export interface Props {
  LogGroups: React.ComponentClass<any> | React.SFC<any>;
  LogStreams: React.ComponentClass<any> | React.SFC<any>;
  LogContent: React.ComponentClass<any> | React.SFC<any>;
  Settings: React.ComponentClass<any> | React.SFC<any>;
  DownloadList: React.ComponentClass<any> | React.SFC<any>;
  windowContent: enums.WindowContent;
  settings: types.Settings;
  logGroupName?: string;
  logStream?: types.LogStream;
  runningJobs: types.DownloadJob[];
  errorJobs: types.DownloadJob[];
  ShowWindowContent: (windowContent: enums.WindowContent) => void;
  LoadSettings: () => void;
  ReloadAll: (settings: types.Settings, logGroupName?: string, logStream?: types.LogStream) => void;
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

            <button className="btn btn-default" onClick={() => props.ReloadAll(props.settings, props.logGroupName, props.logStream)}>
              <span className="icon icon-arrows-ccw icon-text" />Reload
            </button>

            <button className="btn btn-default pull-right" onClick={this.props.OpenGithub}>
              <span className="icon icon-github" />
            </button>

            <div className="pull-right relative">
              <Progress progress={slowestProgress(this.props.runningJobs)} />
              <props.DownloadList />
            </div>

            {this.props.errorJobs.length > 0 ?
              <div className="pull-right">
                <span className="errors">Errors: {this.props.errorJobs.length}</span>
              </div>
              : null}
          </div>
        </header>

        <div className="window-content">
          {createWindowContent(props.windowContent, this.props)}
        </div>
      </div>
    );
  }
}

function buttonState(target: enums.WindowContent, current: enums.WindowContent): string {
  return target === current ? 'active' : '';
}

function createWindowContent(windowContent: enums.WindowContent, props: Props) {
  let { LogGroups, LogStreams, LogContent, Settings } = props;

  switch (windowContent) {
    case enums.WindowContent.LogDownload:
      return (
        <div className="pane-group">
          <div className="pane pane-group">
            <div className="pane">
              <LogGroups />
            </div>
            <div className="pane">
              <LogStreams />
            </div>
          </div>
          <div className="pane">
            <LogContent />
          </div>
        </div>
      );
    case enums.WindowContent.Settings:
      return (
        <Settings />
      );
    default:
      throw new Error('Undefined WindowContent: ' + windowContent);
  }
}

function slowestProgress(runningJobs: types.DownloadJob[]): number {
  return runningJobs
    .map(j => j.progress)
    .reduce((p, c) => Math.min(p, c), 1)
}

export default App;
