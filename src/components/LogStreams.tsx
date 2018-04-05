import * as React from 'react';

export interface Props {
}

function LogStreams({ }: Props) {
  return (
    <ul className="list-group">
      <li className="list-group-header">
        <strong>Log Streams</strong>
      </li>
      <li className="list-group-item">
        <div className="media-body">
          <strong>Stream 1</strong>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </li>
      <li className="list-group-item">
        <div className="media-body">
          <strong>Stream 2</strong>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </li>
    </ul>
  );
}

export default LogStreams;
