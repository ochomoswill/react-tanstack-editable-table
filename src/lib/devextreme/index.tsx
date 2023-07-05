import React, { FunctionComponent } from 'react';
// import 'devextreme/dist/css/dx.light.compact.css';
// import '@/assets/css/dx.generic.smbp-scheme.css'
import '@/assets/css/dx.generic.smbp-compact-scheme.css'


interface OwnProps {
  children?: React.ReactNode
}

type Props = OwnProps;

export const DevExtremeProvider: FunctionComponent<Props> = (props) => {

  return (
      <>{props.children}</>
  );
};


