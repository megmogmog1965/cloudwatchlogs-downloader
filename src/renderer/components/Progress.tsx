import * as React from 'react';
import './Progress.css';

export interface Props {
  progress: number;
}

const Progress: React.SFC<Props> = ({ progress }) => {
  return (
    <progress max="1" value={progress} className="Progress">
      <div className="progress-bar">
        <span style={{ width: (progress * 100) + '%' }}>{progress}</span>
      </div>
    </progress>
  );
};

export default Progress;
