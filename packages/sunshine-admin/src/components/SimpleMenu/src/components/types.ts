import { ReactNode } from 'react';

import { ThemeEnum } from '@/enums/appEnum';
import type { Emitter } from '@/utils/mitt';

import { Fn, Nullable } from '#/global';

export interface MenuProps {
  name?: string | number;
  theme?: ThemeEnum;
  activeName?: string | number;
  openNames?: string[];
  accordion?: boolean;
  width?: string;
  collapsedWidth?: string;
  indentSize?: number;
  collapse?: boolean;
  activeSubMenuNames?: (string | number)[];

  onSelect?: (name: string | number) => any;
  onOpenChange?: (name: string | number) => void;
}

export interface SubMenuProps {
  name: string | number;
  disabled?: boolean;
  collapsedShowTitle?: boolean;

  parentId: string;
  id: string;

  title?: ReactNode;
  children?: ReactNode;
  level?: number;

  childrenCount?: number;
}

export interface MenuItemProps {
  name: string | number;
  disabled?: boolean;
  title?: ReactNode | (() => ReactNode);

  id: string;

  parentId: string;

  level?: number;
}

export const enum MenuCompNameEnum {
  Menu = 'Menu',
  SubMenu = 'SubMenu',
  MenuItem = 'MenuItem',
}
export interface MenuInfo {
  // 组件类型
  compName: MenuCompNameEnum;
  // 组件唯一id
  id: string;
  // 父级 uid
  parentId: Nullable<string>;

  handleMouseleave?: Fn;
  props: Required<MenuProps> | Required<SubMenuProps> | Required<MenuItemProps>;
}

export interface RootState {
  addSubMenu: (name: string | number, update?: boolean) => void;
  removeSubMenu: (name: string | number, update?: boolean) => void;
  removeAll: () => void;
  sliceByIndex: (index: number) => void;
  isRemoveAllPopup: boolean;
  setIsRemoveAllPopup: (flag: boolean) => void;
  openedNames: (string | number)[];
  handleMouseleave?: Fn;
}

export interface RootMenuContextProps {
  rootMenuEmitter: Emitter<MenuEmitterEvents>;
  rootState: RootState;
  rootProps: Required<MenuProps>;
  activeName: string | number;
  menuInfoMap: Map<string, MenuInfo>;
}

export type MenuEmitterEvents = {
  'on-update-opened':
    | (string | number)[]
    | {
        opened: boolean;
        parent?: Nullable<MenuInfo>;
        uidList: string[];
      };
  'on-menu-item-select': string | number;
  'open-name-change': {
    name: string | number;
    opened: boolean;
  };
  'on-update-active-name:submenu': (string | number)[];
};

// export interface SubMenuContextProps {
//   addSubMenu: (name: string | number, update?: boolean) => void;
//   removeSubMenu: (name: string | number, update?: boolean) => void;
//   removeAll: () => void;
//   sliceIndex: (index: number) => void;
//   isRemoveAllPopup: boolean;
//   getOpenNames: () => (string | number)[];
//   handleMouseleave?: Fn;
//   level: number;
//   props: Required<MenuProps>;
// }
