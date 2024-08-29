import { FormOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

interface IProps {
  title?: string;
  children?: ReactNode;
}

const EditTableHeaderIcon = (props: IProps) => {
  const { title = '', children } = props;

  return (
    <span className="edit-header-cell">
      {children}
      {title}
      <FormOutlined />
    </span>
  );
};

export default EditTableHeaderIcon;
