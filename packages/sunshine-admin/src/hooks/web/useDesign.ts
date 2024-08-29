import { prefixCls } from '@/settings/designSetting';

export function useDesign(scope: string) {
  return {
    prefixCls: `${prefixCls}-${scope}`,
    prefixVar: prefixCls,
  };
}
