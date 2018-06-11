import * as React from 'react';
import './DownloadList.css';
import Progress from './Progress';
import { DownloadJob } from '../common-interfaces';

export interface Props {
  jobs: DownloadJob[];
}

const DownloadList: React.SFC<Props> = ({ jobs }) => {
  return (
    <div className="DownloadList pane">
      <ul className="list-group">
        {(jobs.length <= 0) ?
          <li className="list-group-item"><strong>Logs you download appear here</strong></li> :
          jobs.map(j => (
            <li className="list-group-item" onClick={() => undefined}>
              <div className="media-body">
                <strong>{j.logGroupName}</strong>
                <div>
                  <span>{j.logStreamName}</span>
                </div>
                <div className="">
                  <Progress progress={j.progress} />
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default DownloadList;
