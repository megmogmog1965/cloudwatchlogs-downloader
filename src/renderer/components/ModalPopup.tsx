import * as React from 'react';
import './ModalPopup.css';

export interface Props {
  message: string;
  visible: boolean;
  HideMessage: () => void;
}

const ModalPopup: React.SFC<Props> = ({ message, visible, HideMessage }) => {
  return (
    <div className={className(visible)}>
      <div className="overlay" />
      <div className="popup middle">
        <h2>{message}</h2>
        <label className="close" onClick={HideMessage}>&times;</label>
        <div className="content">&nbsp;</div>
      </div>
    </div>
  );
};

function className(visible: boolean): string {
  return visible ? 'ModalPopup visible' : 'ModalPopup invisible';
}

export default ModalPopup;
