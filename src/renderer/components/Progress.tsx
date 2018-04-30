import * as React from 'react';
import './Progress.css';

export interface Props {
  progress: number;
}

const Progress: React.SFC<Props> = ({ progress }) => {
  return (
    <progress max="1" value={progress} className={className(progress)}>
      <div className="progress-bar">
        <span style={{ width: (progress * 100) + '%' }}>{progress}</span>
      </div>
    </progress>
  );
};

function className(progress: number): string {
  return (progress < 1) ? 'Progress active' : 'Progress inactive' ;
}

export default Progress;
