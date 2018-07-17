import * as React from 'react';
import './Balloon.css';

export interface Props {
  visible: boolean;
  message: string;
}

const Balloon: React.SFC<Props> = ({ visible, message }) => {
  return (
    <div className={className(visible)}>
      <p>{message}</p>
    </div>
  );
}

function className(visible: boolean): string {
  return visible ? 'Balloon visible' : 'Balloon invisible';
}

export default Balloon;
