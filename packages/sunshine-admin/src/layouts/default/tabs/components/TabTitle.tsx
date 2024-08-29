import { DropDownProps } from 'antd';

import { Dropdown } from '@/components/Dropdown';
import { Icon } from '@/components/Icon';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';

import { useTabDropdown } from '../useTabDropdown';

import { Tab } from '#/router';

interface IProps {
  item: Tab;
  isExtra?: boolean;
}

const TabTitle = (props: IProps) => {
  const { item, isExtra } = props;
  const { prefixCls } = useDesign('multiple-tabs-content');
  const trigger = (isExtra ? ['click'] : ['contextMenu']) as DropDownProps['trigger'];
  const { t } = useLocale();
  const title = t(item.name);

  const { dropMenuList, handleContextMenu, handleMenuEvent } = useTabDropdown(item);

  const handleContextMenuFn = (e) => {
    item && handleContextMenu(e, item);
  };

  return (
    <Dropdown
      dropMenuList={dropMenuList}
      trigger={trigger}
      placement="bottomLeft"
      overlayClassName="multiple-tabs__dropdown"
      menuEvent={handleMenuEvent}
    >
      <>
        {!isExtra && (
          <div className={`${prefixCls}__info`} onContextMenu={handleContextMenuFn}>
            <span className="ml-1">{title}</span>
          </div>
        )}
        {isExtra && (
          <span className={`${prefixCls}__extra-quick`} onClick={handleContextMenuFn}>
            <Icon icon="ion:chevron-down" />
          </span>
        )}
      </>
    </Dropdown>
  );
};

export default TabTitle;
