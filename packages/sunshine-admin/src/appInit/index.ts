import { initBreakPoint } from './breakPoint';
import { initAppLocale } from './locale';
import { initAppTheme } from './theme';

export const appInit = () => {
  initAppTheme();
  initAppLocale();
  initBreakPoint();
};
