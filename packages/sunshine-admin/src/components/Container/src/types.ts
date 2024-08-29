import { Nullable } from '#/global';

export type ScrollType = 'default' | 'main';

export interface CollapseContainerOptions {
  canExpand?: boolean;
  title?: string;
  helpMessage?: Array<any> | string;
}
export interface ScrollContainerOptions {
  enableScroll?: boolean;
  type?: ScrollType;
}

export type ScrollActionType = {
  scrollBottom: () => void;
  getScrollWrap: () => Nullable<HTMLElement>;
  scrollTo: (top: number) => void;
};
