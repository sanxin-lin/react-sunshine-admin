import { Menu } from 'antd';

import MenuItemContent from './MenuItemContent';

import { BaseProps } from '#/compoments';
import { Menu as MenuType } from '#/router';

interface IProps extends BaseProps {
  item?: MenuType;

  //   level?: number;
  //   theme?:
  //   showTitle?: boolean;
  //   isHorizontal?: boolean;
}

const BasicMenuItem: React.FC<IProps> = (props) => {
  const { item = {} as MenuType, className } = props;
  return (
    <Menu.Item key={item.path} className={`${className}`}>
      <MenuItemContent item={item} />
    </Menu.Item>
  );
};

export default BasicMenuItem;
