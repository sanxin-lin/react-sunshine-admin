import { CSSProperties } from 'react';
import { useCreation } from 'ahooks';
import { isNil } from 'lodash-es';

import { ROOT_UNIQUE_ID } from '@/router/constants';

import { useRootMenuContextSelctor } from './context';
import { MenuCompNameEnum, MenuInfo } from './types';

interface IOptions {
  uid: string;
  parentId?: string;
  level?: number;
}

export const useMenuItem = (options: IOptions) => {
  const { uid, level } = options;
  const { menuInfoMap, rootProps } = useRootMenuContextSelctor((state) => ({
    menuInfoMap: state.menuInfoMap,
    rootProps: state.rootProps,
  }));
  const menuInfo = menuInfoMap.get(uid)!;

  const findParentMenu = (names: MenuCompNameEnum[]) => {
    const { parentId } = menuInfo;
    if (isNil(parentId)) return null;
    let parent = menuInfoMap.get(parentId);
    while (parent && !names.includes(parent.compName)) {
      parent = parent.parentId ? menuInfoMap.get(parent.parentId) : undefined;
    }
    return parent;
  };

  const getParentList = () => {
    const { parentId } = menuInfo;
    if (isNil(parentId)) {
      return {
        uidList: [],
        list: [],
      };
    }
    let parent = menuInfoMap.get(parentId);
    const menuInfos: MenuInfo[] = [];
    while (parent && parent.parentId && parent.compName !== MenuCompNameEnum.Menu) {
      if (parent.compName === MenuCompNameEnum.SubMenu) {
        menuInfos.push(parent);
      }
      parent = menuInfoMap.get(parent.parentId);
    }
    return {
      uidList: menuInfos.map((item) => item.id),
      list: menuInfos,
    };
  };

  const parentMenu = findParentMenu([MenuCompNameEnum.Menu, MenuCompNameEnum.SubMenu]);
  const parentRootMenu = menuInfoMap.get(ROOT_UNIQUE_ID);
  const parentSubMenu = findParentMenu([MenuCompNameEnum.SubMenu]);

  const menuItemStyle: CSSProperties = useCreation(() => {
    if (isNil(level)) return {};
    // const { parentId } = menuInfo;
    // if (isNil(parentId)) return {};
    // let parent = menuInfoMap.get(parentId);
    // if (isNil(parent)) return {};

    // const indentSize = rootProps.indentSize ?? 20;
    // let padding = indentSize;
    // if (rootProps.collapse) {
    //   while (parent && parent.parentId && parent.compName !== MenuCompNameEnum.Menu) {
    //     if (parent.compName === MenuCompNameEnum.SubMenu) {
    //       padding += indentSize;
    //     }
    //     parent = menuInfoMap.get(parent.parentId);
    //   }
    // }
    const indentSize = rootProps.indentSize ?? 20;
    return { paddingLeft: level * indentSize + 'px' };
  }, [rootProps.indentSize, rootProps.collapse]);

  return {
    parentMenu,
    parentRootMenu,
    parentSubMenu,
    getParentList,
    menuItemStyle,
  };
};
