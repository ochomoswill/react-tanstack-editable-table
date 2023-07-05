import React, { FunctionComponent } from 'react';
import {IRadioGroupOptions, RadioGroup} from "devextreme-react/radio-group";

interface OwnProps {
    children?: any
}

export type DxRadioGroupProps = OwnProps & IRadioGroupOptions;

export const DxRadioGroup: FunctionComponent<DxRadioGroupProps> = (props) => {

  return (
      <RadioGroup
          {...props}
      />
  );
};



