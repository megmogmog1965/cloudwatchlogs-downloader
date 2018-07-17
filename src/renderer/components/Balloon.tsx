import * as React from 'react';
import './Balloon.css';

export interface Props {
  visible: boolean;
  message: string;
}

const Balloon: React.SFC<Props> = ({ visible, message }) => {
  return (
    <div className="Balloon" style={{ display: visible ? 'block' : 'none' }}>
      <p>{message}</p>
    </div>
  );
}

export default Balloon;
