import React, { FunctionComponent } from 'react';
import Button from 'devextreme-react/button';

interface OwnProps {}

type Props = OwnProps;

export const DxButton: FunctionComponent<Props> = (props) => {

  return (
      <Button
          text="Click me"
          type={'default'}
          onClick={() => window.alert('Hello World, Dev Extreme')}
      />
  );
};

