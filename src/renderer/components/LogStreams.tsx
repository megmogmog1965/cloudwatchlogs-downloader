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
  // first & last timestamps.
  let first = Math.min(...logStreams.map(s => s.firstEventTimestamp));
  let last = Math.max(...logStreams.map(s => s.lastEventTimestamp));

  return (
    <ul className="list-group">
      <li className="list-group-header">
        <strong>Log Streams</strong>
      </li>
      {logStreams
        .sort((a, b) => b.lastEventTimestamp - a.lastEventTimestamp)
        .map(s => (
          <li className={(selectedName === s.logStreamName) ? 'list-group-item active' : 'list-group-item'} onClick={() => SelectLogStream(s.logStreamName)}>
            <div className="media-body">
              <strong>{s.logStreamName}</strong>
              <p>Last: {new Date(s.lastEventTimestamp).toISOString()}</p>
              {timeRange(first, last, s)}
            </div>
          </li>
        ))}
    </ul>
  );
}

function timeRange(firstEventTimestamp: number, lastEventTimestamp: number, logStream: LogStream) {
  let entireSpan = lastEventTimestamp - firstEventTimestamp;
  let begginingSpan = logStream.firstEventTimestamp - firstEventTimestamp;
  let endSpan = lastEventTimestamp - logStream.lastEventTimestamp;

  let marginLeft = Math.max(0, 100.0 * begginingSpan / entireSpan - 2);
  let marginRight = Math.max(0, 100.0 * endSpan / entireSpan - 1);

  return (
    // <div style={{ border: '1px dashed #999' }}>
    <div style={{ backgroundColor: '#E0E0E0', borderRadius: '3px' }}>
      <div style={{ backgroundColor: '#6FADCF', height: '6px', borderRadius: '3px', marginLeft: `${marginLeft}%`, marginRight: `${marginRight}%` }} />
    </div>
  )
}

export default LogGroups;
