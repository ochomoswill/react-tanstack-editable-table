import Switch, {ISwitchOptions} from 'devextreme-react/switch';
import React, { FunctionComponent } from 'react';
import styled from "@emotion/styled";

interface OwnProps {}

export type DxSwitchProps = OwnProps & ISwitchOptions;

const StyledSwitch = styled(Switch)<ISwitchOptions>`
  .dx-switch-on {
    color: var(--mantine-color-secondary-4);
  }

  &.dx-switch-on-value .dx-switch-handle::before {
    background-color: var(--mantine-color-secondary-4);
  }

  /*&.dx-switch-handle::before {
    background-color: gray;
  }*/

  div.dx-switch-handle::before{
    background-color: var(--mantine-color-gray-6);
  }
  
  &.dx-switch.dx-state-hover.dx-switch-handle::before{
    background-color: var(--mantine-color-secondary-4);
  }

  /*div.dx-switch-container{
    border-color: var(--mantine-color-secondary-4);
  }*/

  div.dx-switch-container:has(.dx-switch-inner > .dx-switch-on){
    border-color: var(--mantine-color-secondary-4);
  }
`

export const DxSwitch: FunctionComponent<DxSwitchProps> = (props) => {

  return (
      <StyledSwitch
          {...props}
      />
  );
};



