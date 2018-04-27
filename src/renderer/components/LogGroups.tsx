import * as React from 'react';
import { LogGroup, Settings } from '../common-interfaces';

export interface Props {
  logGroups: LogGroup[];
  selectedName?: string;
  lastModified: Date;
  settings: Settings;
  FetchLogGroups: (settings: Settings) => void;
  SelectLogGroup: (selectedName: string) => void;
  FetchLogStreams: (settings: Settings, logGroupName: string) => void;
}

class LogGroups extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
  }

  componentDidUpdate(prevProps: Props, prevState: any, prevContext: any) {
    // fetch log groups per 5 minutes.
    let secondsLastModified = (new Date().getTime() - this.props.lastModified.getTime()) / 1000;
    let threshold = 5 * 60;
    if (secondsLastModified > threshold) {
      this.props.FetchLogGroups(this.props.settings);
    }
  }

  render() {
    let props = this.props;

    let onClick = (logGroupName: string) => {
      props.SelectLogGroup(logGroupName);
      props.FetchLogStreams(props.settings, logGroupName);
    };

    return (
      <ul className="LogGroups list-group">
        <li className="list-group-header">
          <strong>Log Groups</strong>
        </li>
        {props.logGroups.map(g => (
          <li className={(props.selectedName === g.logGroupName) ? 'list-group-item active' : 'list-group-item'} onClick={() => onClick(g.logGroupName)}>
            <div className="media-body">
              <strong>{g.logGroupName}</strong>
              <p>Created: {new Date(g.creationTime).toISOString()}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default LogGroups;
