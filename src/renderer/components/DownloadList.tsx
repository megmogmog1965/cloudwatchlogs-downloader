import * as React from 'react';
import './DownloadList.css';
import { Settings } from '../common-interfaces';

export interface Props {
  settings: Settings;
}

const DownloadList: React.SFC<Props> = ({ settings }) => {
  return (
    <div className="DownloadList">
      <p>A list of downloads.</p>
    </div>
  );
}

export default DownloadList;
