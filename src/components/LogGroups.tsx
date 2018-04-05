import * as React from 'react';
import { LogGroup } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';
import * as actions from '../actions';
import store from '../Store';

export interface Props {
  logGroups: LogGroup[];
  selectedArn?: string;
  settings: Settings;
  SelectLogGroup: (selectedArn: string) => void;
}

class LogGroups extends React.Component<Props, any> {

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    store.dispatch(actions.fetchLogGroups(this.props.settings));
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
