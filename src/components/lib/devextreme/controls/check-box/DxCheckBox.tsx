import CheckBox, {ICheckBoxOptions} from 'devextreme-react/check-box';
import React, { FunctionComponent } from 'react';
import styled from "@emotion/styled";
import Switch, {ISwitchOptions} from "devextreme-react/switch";

interface OwnProps {}

export type DxCheckBoxProps = OwnProps & ICheckBoxOptions;

const StyledCheckbox = styled(CheckBox)<ICheckBoxOptions>`
  .dx-checkbox-icon {
    border: 1px solid var(--mantine-color-primary-4);
    // background-color: var(--mantine-color-secondary-4);
  }

  &.dx-checkbox-checked .dx-checkbox-icon {
    color: white;
    text-align: center;
    background-color: var(--mantine-color-primary-4);
    border: 1px solid var(--mantine-color-primary-4) !important;
  }

  &.dx-state-disabled .dx-checkbox-icon {
    border-color: var(--mantine-color-gray-4);
  }
`

export const DxCheckBox: FunctionComponent<DxCheckBoxProps> = (props) => {

  return (
      <StyledCheckbox
          {...props}
      />
  );
};



