import React, { FunctionComponent } from 'react';
import TextArea, {ITextAreaOptions} from "devextreme-react/text-area";

interface OwnProps {
    children?: any
}

export type DxTextAreaProps = OwnProps & ITextAreaOptions;

export const DxTextArea: FunctionComponent<DxTextAreaProps> = (props) => {

  return (
      <TextArea
          {...props}
      />
  );
};



