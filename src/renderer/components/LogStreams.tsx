import * as React from 'react';
import { LogStream, Settings } from '../common-interfaces';

export interface Props {
  logStreams: LogStream[];
  selectedName?: string;
  lastModified: Date;
  settings: Settings;
  logGroupName?: string;
  SelectLogStream: (selectedName: string) => void;
  FetchLogText: (settings: Settings, logGroupName: string, logStreamName: string) => void;
  Now: () => Date;
}

const LogStreams: React.SFC<Props> = ({ logStreams, selectedName, lastModified, settings, logGroupName, SelectLogStream, FetchLogText, Now }) => {
  // first & last timestamps.
  let first = Math.min(...logStreams.map(s => s.firstEventTimestamp));

  const onClick = (logStreamName: string) => {
    SelectLogStream(logStreamName);
    if (logGroupName) {
      FetchLogText(settings, logGroupName, logStreamName);
    }
  }

  return (
    <ul className="LogStreams list-group">
      <li className="list-group-header">
        <strong>Log Streams</strong>
      </li>
      {logStreams
        .sort(descendedCompareFn)
        .map(s => (
          <li className={(selectedName === s.logStreamName) ? 'list-group-item active' : 'list-group-item'} onClick={() => onClick(s.logStreamName)}>
            <div className="media-body">
              <strong>{s.logStreamName}</strong>
              <p>Last: {new Date(s.lastEventTimestamp).toISOString()}</p>
              {timeRange(first, s, Now)}
            </div>
          </li>
        ))}
    </ul>
  );
}

/**
 * First, this function represents descended order by timestamp, then ascended order by log stream name.
 */
function descendedCompareFn(a: LogStream, b: LogStream): number {
  let diff = b.lastEventTimestamp - a.lastEventTimestamp;
  return diff !== 0 ? diff : a.logStreamName.localeCompare(b.logStreamName);
}

function timeRange(firstEventTimestamp: number, logStream: LogStream, now: () => Date) {
  let current = now().getTime();
  let entireSpan = current - firstEventTimestamp;
  let begginingSpan = logStream.firstEventTimestamp - firstEventTimestamp;
  let endSpan = current - logStream.lastEventTimestamp;

  let marginLeft = Math.max(0, 100.0 * begginingSpan / entireSpan - 2);
  let marginRight = Math.max(0, 100.0 * endSpan / entireSpan - 1);

  return (
    // <div style={{ border: '1px dashed #999' }}>
    <div style={{ backgroundColor: '#E0E0E0', borderRadius: '3px' }}>
      <div style={{ backgroundColor: '#6FADCF', height: '6px', borderRadius: '3px', marginLeft: `${marginLeft}%`, marginRight: `${marginRight}%` }} />
    </div>
  )
}

export default LogStreams;
