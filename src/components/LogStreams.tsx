import * as React from 'react';
import { LogStream } from '../common-interfaces/Aws';
import { Settings } from '../common-interfaces/Settings';

export interface Props {
  logStreams: LogStream[];
  selectedName?: string;
  lastModified: Date;
  settings: Settings;
  SelectLogStream: (selectedName: string) => void;
}

function LogGroups({ logStreams, selectedName, lastModified, SelectLogStream }: Props) {
  return (
    <ul className="list-group">
      <li className="list-group-header">
        <strong>Log Groups</strong>
      </li>
      {logStreams.map(s => (
        <li className={(selectedName === s.logStreamName) ? 'list-group-item active' : 'list-group-item'} onClick={() => SelectLogStream(s.logStreamName)}>
          <div className="media-body">
            <strong>{s.logStreamName}</strong>
            <p>- Created: {new Date(s.firstEventTimestamp).toISOString()}</p>
            <p>- Bytes: {s.storedBytes}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default LogGroups;
