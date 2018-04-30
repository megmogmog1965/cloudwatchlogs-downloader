import * as React from 'react';
import './Progress.css';

export interface Props {
  progress: number;
}

const Progress: React.SFC<Props> = ({ progress }) => {
  return (
    <div className="Progress">
      <progress max="1" value={progress} className={className(progress)} />
      <span className="progress-label" style={{ right: (1.02 - progress) * 100 + '%' }}>{Math.ceil(progress * 100)}%</span>
    </div>
  );
};

function className(progress: number): string {
  return (progress < 1) ? 'active' : 'inactive' ;
}

export default Progress;
