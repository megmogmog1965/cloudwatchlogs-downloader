import * as React from 'react';
import './ModalPopup.css';

export interface Props {
  visible: boolean;
  message: string;
  subMessage?: string;
  HideMessage: () => void;
}

const ModalPopup: React.SFC<Props> = ({ visible, message, subMessage, HideMessage }) => {
  return (
    <div className={className(visible)}>
      <div className="overlay" />
      <div className="popup middle">
        <h2>{message}</h2>
        <span className="icon icon-cancel-squared close" onClick={HideMessage} />
        <div className="content">{subMessage !== undefined ? subMessage : ' '}</div>
      </div>
    </div>
  );
};

function className(visible: boolean): string {
  return visible ? 'ModalPopup visible' : 'ModalPopup invisible';
}

export default ModalPopup;
