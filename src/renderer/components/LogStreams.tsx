import * as React from 'react';
import moment from 'moment';
import './LogStreams.css';
import { LogStream, Settings } from '../common-interfaces';

export interface Props {
  logStreams: LogStream[];
  selectedName?: string;
  lastModified: Date;
  settings: Settings;
  logGroupName?: string;
  SelectLogStream: (selectedName: string) => void;
  FetchLogText: (settings: Settings, logGroupName: string, logStream: LogStream) => void;
  Now: () => Date;
}

const LogStreams: React.SFC<Props> = ({ logStreams, selectedName, lastModified, settings, logGroupName, SelectLogStream, FetchLogText, Now }) => {
  // first & last timestamps.
  let first = Math.min(...logStreams.map(s => s.firstEventTimestamp));

  const onClick = (logStream: LogStream) => {
    SelectLogStream(logStream.logStreamName);
    if (logGroupName) {
      FetchLogText(settings, logGroupName, logStream);
    }
  }

  return (
    <ul className="LogStreams list-group">
      <li className="list-group-header">
        <strong>Log Streams</strong>
      </li>
      {logStreams
        .slice() // clone it before sort.
        .sort(descendedCompareFn) // mutated by sort().
        .map(s => (
          <li className={(selectedName === s.logStreamName) ? 'list-group-item active' : 'list-group-item'} onClick={() => onClick(s)}>
            <div className="media-body">
              <strong>{s.logStreamName}</strong>
              <div className="clearfix">
                <p className="left">From: {dateString(new Date(s.firstEventTimestamp))}</p>
                <p className="right">To: {dateString(new Date(s.lastEventTimestamp))}</p>
              </div>
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

function dateString(date: Date): string {
  return moment(date).format('YYYY/MM/DD');
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
