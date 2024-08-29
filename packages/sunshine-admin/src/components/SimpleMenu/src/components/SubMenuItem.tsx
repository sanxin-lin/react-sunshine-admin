import { CSSProperties } from 'react';
import { useCreation, useMount, useReactive } from 'ahooks';
import { Popover } from 'antd';
import classNames from 'classnames';
import { isBoolean, isPlainObject } from 'lodash-es';

import { Icon } from '@/components/Icon';
import { CollapseTransition } from '@/components/Transition';
import { useEarliest } from '@/hooks/utils/useEarliest';
import { useDesign } from '@/hooks/web/useDesign';
import { mitt } from '@/utils/mitt';

import { useRootMenuContextSelctor } from './context';
import { MenuCompNameEnum, MenuInfo, SubMenuProps } from './types';
import { useMenuItem } from './useMenuItem';

import { BaseProps } from '#/compoments';
import { Recordable, TimeoutHandle } from '#/global';

const DELAY = 50;
const SubMenuItem: React.FC<SubMenuProps & BaseProps> = (props) => {
  const {
    name,
    disabled,
    collapsedShowTitle,
    parentId,
    children,
    level,
    id,
    title,
    className,
    childrenCount = 0,
  } = props;
  const { rootMenuEmitter, menuInfoMap, rootState, rootProps } = useRootMenuContextSelctor(
    (state) => state,
  );
  const state = useReactive({
    active: false,
    opened: false,
  });

  const data = useReactive({
    timeout: null as TimeoutHandle | null,
    mouseInChild: false,
    isChild: false,
  });
  const subMenuEmitter = useEarliest(() => mitt());
  const { prefixCls } = useDesign('menu');
  const {
    addSubMenu: parentAddSubmenu,
    removeSubMenu: parentRemoveSubmenu,
    removeAll: parentRemoveAll,
    openedNames,
    isRemoveAllPopup,
    setIsRemoveAllPopup,
    sliceByIndex,
    handleMouseleave: parentHandleMouseleave,
  } = rootState;
  const info: MenuInfo = {
    id: id,
    parentId,
    compName: MenuCompNameEnum.SubMenu,
    props: {
      name,
      disabled,
      collapsedShowTitle,
    } as Required<SubMenuProps>,
  };
  menuInfoMap.set(id, info);
  const { parentMenu, parentSubMenu, getParentList, menuItemStyle } = useMenuItem({
    uid: id,
    level,
  });
  const wrapperClassName = classNames(`${prefixCls}-submenu`, {
    [`${prefixCls}-opened`]: state.opened,
    [`${prefixCls}-submenu-disabled`]: props.disabled,
    [`${prefixCls}-submenu-has-parent-submenu`]: parentSubMenu,
    [`${prefixCls}-child-item-active`]: state.active,
  });
  const { accordion, collapse, theme, activeSubMenuNames } = rootProps;

  const overlayStyle = useCreation<CSSProperties>(
    () => ({
      minWidth: '200px',
      paddingLeft: '12px',
    }),
    [],
  );

  const isOpened = (() => {
    if (collapse) {
      return openedNames.includes(name);
    }
    return state.opened;
  })();
  const isActive = activeSubMenuNames.includes(name);
  const subClassName = classNames(`${prefixCls}-submenu-title`, {
    [`${prefixCls}-submenu-active`]: isActive,
    [`${prefixCls}-submenu-active-border`]: isActive && level === 1,
    [`${prefixCls}-submenu-collapse`]: collapse && level === 1,
  });

  const handleClick: any = (e: MouseEvent) => {
    e.stopPropagation();
    if (disabled || collapse) return;
    const opened = state.opened;
    if (accordion) {
      const { uidList } = getParentList();
      rootMenuEmitter.emit('on-update-opened', {
        opened: false,
        parent: parentMenu,
        uidList: uidList,
      });
    } else {
      rootMenuEmitter.emit('open-name-change', {
        name,
        opened: !opened,
      });
    }
    state.opened = !opened;
  };

  const handleMouseenter = () => {
    if (disabled) return;

    subMenuEmitter.current.emit('submenu:mouse-enter-child');

    const index = openedNames.findIndex((item) => item === name);
    sliceByIndex(index);

    const isRoot = level === 1 && openedNames.length === 2;

    if (isRoot) {
      parentRemoveAll();
    }
    data.isChild = openedNames.includes(name);
    clearTimeout(data.timeout!);
    data.timeout = setTimeout(() => {
      parentAddSubmenu(name);
    }, DELAY);
  };

  const handleMouseleave = (deepDispatch = false) => {
    const parentName = parentMenu?.props.name;
    if (!parentName) {
      setIsRemoveAllPopup(true);
    }

    if (openedNames.slice(-1)[0] === name) {
      data.isChild = false;
    }

    subMenuEmitter.current.emit('submenu:mouse-leave-child');
    if (data.timeout) {
      clearTimeout(data.timeout!);
      data.timeout = setTimeout(() => {
        if (isRemoveAllPopup) {
          parentRemoveAll();
        } else if (!data.mouseInChild) {
          parentRemoveSubmenu(name);
        }
      }, DELAY);
    }
    if (deepDispatch) {
      if (parentSubMenu) {
        parentHandleMouseleave?.(true);
      }
    }
  };
  info.handleMouseleave = handleMouseleave;

  const handleVisibleChange = (visible: boolean) => {
    state.opened = visible;
  };

  const getEvents = (deep: boolean) => {
    if (!collapse) return {};
    return {
      onMouseEnter: handleMouseenter,
      onMouseLeave: () => handleMouseleave(deep),
    };
  };

  useMount(() => {
    subMenuEmitter.current.on('submenu:mouse-enter-child', () => {
      data.mouseInChild = true;
      setIsRemoveAllPopup(false);
      clearTimeout(data.timeout!);
    });
    subMenuEmitter.current.on('submenu:mouse-leave-child', () => {
      if (data.isChild) return;
      data.mouseInChild = false;
      clearTimeout(data.timeout!);
    });

    rootMenuEmitter.on(
      'on-update-opened',
      (data: boolean | (string | number)[] | Recordable<any>) => {
        if (collapse) return;
        if (isBoolean(data)) {
          state.opened = data;
          return;
        }
        if (isPlainObject(data) && accordion) {
          const { opened, parent, uidList } = data as Recordable<any>;
          if (parent.id === parentId) {
            state.opened = opened;
          } else if (!uidList.includes(id)) {
            state.opened = false;
          }
          return;
        }

        if (name && Array.isArray(data)) {
          state.opened = (data as (string | number)[]).includes(name);
        }
      },
    );

    rootMenuEmitter.on('on-update-active-name:submenu', (data) => {
      state.active = data.includes(id);
    });
  });
  const renderChildren = () => {
    if (collapse) {
      return (
        <Popover
          placement="right"
          overlayClassName={`${prefixCls}-menu-popover`}
          open={isOpened}
          onOpenChange={handleVisibleChange}
          overlayStyle={overlayStyle}
          overlayInnerStyle={{ padding: 0 }}
          align={{ offset: [0, 0] }}
          content={
            <div {...getEvents(true)}>
              <ul className={`${prefixCls} ${prefixCls}-${theme} ${prefixCls}-popup`}>
                {children}
              </ul>
            </div>
          }
        >
          <>
            <div className={subClassName} {...getEvents(false)}>
              <div
                className={classNames({
                  [`${prefixCls}-submenu-popup`]: !parentSubMenu,
                  [`${prefixCls}-submenu-collapsed-show-tit`]: collapsedShowTitle,
                })}
              >
                {title}
              </div>
              {parentSubMenu && (
                <>
                  <Icon
                    icon="eva:arrow-ios-downward-outline"
                    size={14}
                    className={`${prefixCls}-submenu-title-icon`}
                  />
                </>
              )}
            </div>
          </>
        </Popover>
      );
    }
    return (
      <>
        <div
          className={`${prefixCls}-submenu-title ${className}`}
          onClick={handleClick}
          style={menuItemStyle}
        >
          {title}
          <Icon
            icon="eva:arrow-ios-downward-outline"
            size={14}
            className={`${prefixCls}-submenu-title-icon`}
          />
        </div>
        <CollapseTransition
          collapse={!state.opened}
          startHeight={0}
          endHeight={childrenCount * 46.5}
        >
          {state.opened && <ul className={prefixCls}>{children}</ul>}
        </CollapseTransition>
      </>
    );
  };

  return <li className={`${wrapperClassName} ${className}`}>{renderChildren()}</li>;
};

export default SubMenuItem;
