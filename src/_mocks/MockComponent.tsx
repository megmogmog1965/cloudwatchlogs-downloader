import * as React from 'react';

export interface Props {
  name?: string;
}

const MockComponent: React.SFC<Props> = ({ name }: Props) => {
  return (
    <div className={'MockComponent ' + name ? name : ''} />
  );
};

export default MockComponent;
