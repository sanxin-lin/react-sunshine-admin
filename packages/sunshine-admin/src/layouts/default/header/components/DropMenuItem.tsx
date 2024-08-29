import { Menu } from 'antd';

import { Icon } from '@/components/Icon';

interface IProps {
  text: string;
  icon: string;
  key: any;
}

const DropMenuItem = (props: IProps) => {
  const { text, icon, key } = props;

  return (
    <Menu.Item key={key}>
      <span className="flex items-center">
        <Icon icon={icon} className="mr-1" />
        <span>{text}</span>
      </span>
    </Menu.Item>
  );
};

export default DropMenuItem;
