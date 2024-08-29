import type { PopconfirmProps } from 'antd';

import { Fn } from '#/global';

export interface DropMenu {
  onClick?: Fn;
  to?: string;
  icon?: string;
  event: string | number;
  text: string;
  disabled?: boolean;
  divider?: boolean;
  popConfirm?: PopconfirmProps;
}
