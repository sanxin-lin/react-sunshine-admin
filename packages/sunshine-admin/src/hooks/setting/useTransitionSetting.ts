import { useAppStore, useAppStoreActions } from '@/stores/modules/app';

import { TransitionSetting } from '#/config';

export const useTransitionSetting = () => {
  const projectConfig = useAppStore((state) => state.getProjectConfig());
  const { setProjectConfig } = useAppStoreActions();
  const { transitionSetting } = projectConfig;

  const setTransitionSetting = (transitionSetting: Partial<TransitionSetting>) => {
    setProjectConfig({ transitionSetting });
  };

  return {
    ...transitionSetting,
    setTransitionSetting,
  };
};
