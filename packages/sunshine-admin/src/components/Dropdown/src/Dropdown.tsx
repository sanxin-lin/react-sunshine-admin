import React from 'react';
import { useCreation } from 'ahooks';
import type { DropDownProps, MenuProps, PopconfirmProps } from 'antd';
import { Dropdown, Menu, Popconfirm } from 'antd';

import { Icon } from '@/components/Icon';

import { DropMenu } from './types';

import { Recordable } from '#/global';

interface IProps {
  popconfirm?: boolean;
  trigger?: DropDownProps['trigger'];
  dropMenuList?: (DropMenu & Recordable<any>)[];
  selectedKeys?: MenuProps['selectedKeys'];

  menuEvent?: (...args: any[]) => void;
}

const DropdownComp: React.FC<IProps & Partial<PopconfirmProps> & DropDownProps> = (props) => {
  const {
    popconfirm,
    trigger = ['contextMenu'],
    dropMenuList = [],
    selectedKeys = [],
    children,
    menuEvent,

    ..._restProps
  } = props;

  const restProps = _restProps as any;

  const handleClickMenu = (item: DropMenu) => {
    const { event } = item;
    const menu = dropMenuList.find((item) => `${item.event}` === `${event}`);
    menuEvent?.(menu);
    item.onClick?.();
  };

  const getMenuItemJSX = (item: DropMenu & Recordable<any>) => {
    const textJSX = (
      <div>
        {item.icon && <Icon icon={item.icon} />}
        <span className="ml-1">{item.text}</span>
      </div>
    );

    let jsxEle: React.JSX.Element;

    if (popconfirm && item.popConfirm) {
      jsxEle = (
        <Popconfirm {...restProps} disabled={item.disabled} icon={item.popConfirm.icon}>
          {textJSX}
        </Popconfirm>
      );
    } else {
      jsxEle = textJSX;
    }
    jsxEle = (
      <>
        {jsxEle}
        {item.divider && <Menu.Divider />}
      </>
    );
    return jsxEle;
  };
  // const items = useCreation((): MenuProps['items'] => {
  //   return dropMenuList.map((item) => ({
  //     label: getMenuItemJSX(item),
  //     onClick: (e) => {
  //       // 阻止冒泡
  //       e.domEvent.stopPropagation();
  //       handleClickMenu(item);
  //     },
  //     disabled: item.disabled,
  //     key: item.event,
  //     // children: getMenuItemJSX(item),
  //   }));
  // }, [dropMenuList]);
  const items = dropMenuList.map((item) => ({
    label: getMenuItemJSX(item),
    onClick: (e) => {
      // 阻止冒泡
      e.domEvent.stopPropagation();
      handleClickMenu(item);
    },
    disabled: item.disabled,
    key: item.event,
    // children: getMenuItemJSX(item),
  }));

  const menuProps = useCreation((): MenuProps => {
    return {
      selectedKeys,
      items,
    };
  }, [items, selectedKeys]);
  // const getMenuJSX = () => {
  //   return (
  //     <Menu selectedKeys={selectedKeys}>
  //       {dropMenuList.map((item) => (
  //         <Menu.Item
  //           {...getAttr(item.event)}
  //           onClick={() => handleClickMenu(item)}
  //           disabled={item.disabled}
  //           key={item.event}
  //         >
  //           {getMenuItemJSX(item)}
  //         </Menu.Item>
  //       ))}
  //     </Menu>
  //   );
  // };

  return (
    <Dropdown trigger={trigger} {...restProps} menu={menuProps}>
      <span>{children}</span>
    </Dropdown>
  );
};

export default DropdownComp;
