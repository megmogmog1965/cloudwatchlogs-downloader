import * as React from 'react';
import './Loading.css';

export interface Props {
  text: string;
}

function Loading({ text }: Props) {
  return (
    <div className="Loading">
      <span className="line line-1" />
      <span className="line line-2" />
      <span className="line line-3" />
      <span className="line line-4" />
      <span className="line line-5" />
      <span className="line line-6" />
      <span className="line line-7" />
      <span className="line line-8" />
      <span className="line line-9" />
      <div>{text}</div>
    </div>
  );
};

export default Loading;
