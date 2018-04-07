import * as React from 'react';
import { LogGroup } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';

export interface Props {
  logGroups: LogGroup[];
  selectedArn?: string;
  lastModified: Date;
  settings: Settings;
  FetchLogGroups: (settings: Settings) => void;
  SelectLogGroup: (selectedArn: string) => void;
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
    return (
      <ul className="list-group">
        <li className="list-group-header">
          <strong>Log Groups</strong>
        </li>
        {this.props.logGroups.map(g => (
          <li className={(this.props.selectedArn === g.arn) ? 'list-group-item active' : 'list-group-item'} onClick={() => this.props.SelectLogGroup(g.arn)}>
            <div className="media-body">
              <strong>{g.logGroupName}</strong>
              <p>- Created: {g.creationTime ? new Date(g.creationTime).toISOString() : ''}</p>
              <p>- Bytes: {g.storedBytes}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default LogGroups;
