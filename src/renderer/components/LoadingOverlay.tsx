import * as React from 'react';
import './LoadingOverlay.css';

export interface Props {
  visible: boolean;
}

const LoadingOverlay: React.SFC<Props> = ({ visible }) => {
  return (
    <div className={className(visible)}>
      {/* https://loading.io/css/ */}
      <div className="lds-hourglass middle" />
    </div>
  );
};

function className(visible: boolean): string {
  return visible ? 'LoadingOverlay visible' : 'LoadingOverlay invisible';
}

export default LoadingOverlay;
