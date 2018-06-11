import * as React from 'react';
import './DownloadBadge.css';
import { DownloadJob } from '../common-interfaces';

export interface Props {
  jobs: DownloadJob[];
}

const DownloadBadge: React.SFC<Props> = ({ jobs }) => {
  let runnings = jobs.filter(j => j.progress < 1.0);

  return (
    <div className="DownloadBadge">
      {(runnings.length <= 0) ? '' :
        <div className="badge">
          <span>{runnings.length}</span>
        </div>
      }
    </div>
  );
}

export default DownloadBadge;
