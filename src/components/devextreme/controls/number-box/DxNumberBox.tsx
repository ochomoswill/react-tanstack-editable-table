import React, { FunctionComponent } from 'react';
import NumberBox, {INumberBoxOptions} from "devextreme-react/number-box";

interface OwnProps {}

export type DxNumberBoxProps = OwnProps & INumberBoxOptions;

export const DxNumberBox: FunctionComponent<DxNumberBoxProps> = (props) => {

  return (
      <NumberBox
          {...props}
      />
  );
};



