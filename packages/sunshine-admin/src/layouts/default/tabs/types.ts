import { RouteObject } from 'react-router-dom';

import type { DropMenu } from '@/components/Dropdown';

export enum TabContentEnum {
  TAB_TYPE,
  EXTRA_TYPE,
}

export type { DropMenu };

export interface TabContentProps {
  tabItem: RouteObject;
  type?: TabContentEnum;
  trigger?: ('click' | 'hover' | 'contextmenu')[];
}

export enum MenuEventEnum {
  REFRESH_PAGE,
  CLOSE_CURRENT,
  CLOSE_LEFT,
  CLOSE_RIGHT,
  CLOSE_OTHER,
  CLOSE_ALL,
  SCALE,
}
