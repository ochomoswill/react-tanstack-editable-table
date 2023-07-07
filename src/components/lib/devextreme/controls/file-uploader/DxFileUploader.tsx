import FileUploader, {IFileUploaderOptions} from 'devextreme-react/file-uploader';
import React, { FunctionComponent } from 'react';

interface OwnProps {}

export type DxFileUploaderProps = OwnProps & IFileUploaderOptions;

export const DxFileUploader: FunctionComponent<DxFileUploaderProps> = (props) => {

  return (
      <FileUploader
          {...props}
      />
  );
};



