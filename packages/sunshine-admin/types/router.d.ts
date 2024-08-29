export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  id: string;
  name: string;

  icon?: string;

  img?: string;

  path: string;

  // path contains param, auto assignment.
  paramPath?: string;

  disabled?: boolean;

  children?: Menu[];

  orderNo?: number;

  roles?: RoleEnum[];

  tag?: MenuTag;

  hidden?: boolean;

  parentId: string;

  handle?: Record<any, any>;
}

export interface Tab extends Menu {
  id: string;
  name: string;

  icon?: string;
  path: string;
  handle: Record<any, any>;
}
