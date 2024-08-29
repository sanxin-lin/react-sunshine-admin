import { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import { useDesign } from '@/hooks/web/useDesign';

import { useRootMenuContextSelctor } from './context';
import { MenuCompNameEnum, MenuInfo, MenuItemProps } from './types';
import { useMenuItem } from './useMenuItem';

import { BaseProps } from '#/compoments';

const MenuItem: React.FC<MenuItemProps & BaseProps> = (props) => {
  const {
    name,
    disabled = false,
    parentId,
    title,
    children,
    level,
    id,
    className,
    ...wrapperProps
  } = props;
  const [active, setActive] = useState(false);
  const { rootMenuEmitter, activeName, rootProps, menuInfoMap } = useRootMenuContextSelctor(
    (state) => state,
  );
  const menuInfo = {
    id: id,
    compName: MenuCompNameEnum.MenuItem,
    parentId,
    props: {
      name,
      disabled,
    } as Required<MenuItemProps>,
  } as MenuInfo;
  menuInfoMap.set(id, menuInfo);
  const { prefixCls } = useDesign('menu');
  const wrapperClassName = classNames(`${prefixCls}-item ${className}`, {
    [`${prefixCls}-item-active`]: active,
    [`${prefixCls}-item-selected`]: active,
    [`${prefixCls}-item-disabled`]: disabled,
  });
  const { menuItemStyle, getParentList, parentMenu } = useMenuItem({
    uid: id,
    level,
  });
  const collapse = rootProps.collapse;
  const showTooltip = parentMenu?.compName === MenuCompNameEnum.Menu && collapse && title;

  const handleClickItem: any = (e: MouseEvent) => {
    e.stopPropagation();
    if (disabled) {
      return;
    }

    rootMenuEmitter.emit('on-menu-item-select', props.name);
    if (collapse) {
      return;
    }
    const { uidList } = getParentList();
    rootMenuEmitter.emit('on-update-opened', {
      opened: false,
      parent: parentMenu,
      uidList: uidList,
    });
  };
  useEffect(() => {
    if (activeName === name) {
      const { uidList } = getParentList();

      setActive(true);
      // list.forEach((item) => {
      //   // TODO item.proxy
      //   //   if (item.proxy) {
      //   //     (item.proxy as any).active = true;
      //   //   }
      // });

      rootMenuEmitter.emit('on-update-active-name:submenu', uidList);
    } else {
      setActive(false);
    }
  }, [activeName, name]);

  return (
    <li
      {...wrapperProps}
      className={wrapperClassName}
      onClick={handleClickItem}
      style={collapse ? {} : menuItemStyle}
    >
      {showTooltip && (
        <Tooltip placement="right" title={title}>
          <div className={`${prefixCls}-tooltip`}>{children}</div>
        </Tooltip>
      )}
      {!showTooltip && (
        <>
          {children} {title}
        </>
      )}
    </li>
  );
};

export default MenuItem;
