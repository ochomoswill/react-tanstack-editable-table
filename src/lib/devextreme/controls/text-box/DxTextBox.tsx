import React, { FunctionComponent } from 'react';
import TextBox, {ITextBoxOptions} from "devextreme-react/text-box";

interface OwnProps {
    children?: any
}

export type DxTextBoxProps = OwnProps & ITextBoxOptions;

export const DxTextBox: FunctionComponent<DxTextBoxProps> = (props) => {

  return (
      <TextBox
          {...props}
      />
  );
};



