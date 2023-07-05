import React, { FunctionComponent } from 'react';
import DateBox, {IDateBoxOptions} from "devextreme-react/date-box";

interface OwnProps {}

export type DxDateBoxProps = OwnProps & IDateBoxOptions;

export const DxDateBox: FunctionComponent<DxDateBoxProps> = (props) => {

  return (
      <DateBox
          {...props}
      />
  );
};



