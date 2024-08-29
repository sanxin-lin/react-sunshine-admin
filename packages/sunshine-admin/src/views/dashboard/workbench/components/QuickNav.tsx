import type { CardProps } from 'antd';
import { Card } from 'antd';

import { Icon } from '@/components/Icon';

import { navItems } from './data';

interface IProps extends CardProps {}

const QuickNav = (props: IProps) => {
  return (
    <Card {...props} title="快捷导航">
      {navItems.map((item, index) => (
        <Card.Grid key={index}>
          <span className="flex flex-col items-center">
            <Icon icon={item.icon} color={item.color} size="20" />
            <span className="text-md mt-2 truncate">{item.title}</span>
          </span>
        </Card.Grid>
      ))}
    </Card>
  );
};

export default QuickNav;
