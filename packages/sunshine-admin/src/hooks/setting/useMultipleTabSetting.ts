import { useAppStore, useAppStoreActions } from '@/stores/modules/app';

export const useMultipleTabSetting = () => {
  const { setMultiTabsSetting } = useAppStoreActions();
  const projectConfig = useAppStore((state) => state.getProjectConfig());
  const multiTabsSetting = projectConfig.multiTabsSetting;

  return {
    ...multiTabsSetting,
    setMultiTabsSetting,
  };
};
