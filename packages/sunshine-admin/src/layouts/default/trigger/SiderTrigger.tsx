import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

import { useMenuSetting } from '@/hooks/setting/useMenuSetting';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const SiderTrigger = (props: IProps) => {
  const { collapsed, toggleCollapsed } = useMenuSetting();

  return (
    <div
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        toggleCollapsed();
      }}
    >
      {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
    </div>
  );
};

export default SiderTrigger;
