// import { useRedo } from '@/hooks/web/usePage';
import { useGo } from '@/hooks/web/usePage';
import { useAppStore } from '@/stores/modules/app';
import { useMultipleTabStoreActions } from '@/stores/modules/multipleTab';

import { Tab } from '#/router';

enum TableActionEnum {
  REFRESH,
  CLOSE_ALL,
  CLOSE_LEFT,
  CLOSE_RIGHT,
  CLOSE_OTHER,
  CLOSE_CURRENT,
  CLOSE,
}

export const useTabs = () => {
  const projectSetting = useAppStore((state) => state.getProjectConfig());
  const { updateRefreshKey, closeTab, closeAllTab, closeLeftTabs, closeRightTabs, closeOtherTabs } =
    useMultipleTabStoreActions();
  const go = useGo();
  //   const redo = useRedo();
  const getShow = () => {
    const show = projectSetting.multiTabsSetting.show;
    if (!show) {
      throw new Error('The multi-tab page is currently not open, please open it in the settings！');
    }
    return !!show;
  };

  const handleTabActions = (action: TableActionEnum, tab?: Tab) => {
    if (!getShow()) return;
    switch (action) {
      case TableActionEnum.REFRESH:
        updateRefreshKey();
        break;
      case TableActionEnum.CLOSE_ALL:
        closeAllTab();
        break;
      case TableActionEnum.CLOSE_LEFT:
        closeLeftTabs(tab!);
        break;

      case TableActionEnum.CLOSE_RIGHT:
        closeRightTabs(tab!);
        break;
      case TableActionEnum.CLOSE_CURRENT:
      case TableActionEnum.CLOSE:
        closeTab(tab!, (path) => {
          go(path, true);
        });
        break;

      case TableActionEnum.CLOSE_OTHER:
        closeOtherTabs(tab!);
        break;
    }
  };

  return {
    refreshPage: () => handleTabActions(TableActionEnum.REFRESH),
    closeCurrent: (tab: Tab) => handleTabActions(TableActionEnum.CLOSE_CURRENT, tab),
    closeAll: () => handleTabActions(TableActionEnum.CLOSE_ALL),
    closeRight: (tab: Tab) => handleTabActions(TableActionEnum.CLOSE_RIGHT, tab),
    closeLeft: (tab: Tab) => handleTabActions(TableActionEnum.CLOSE_LEFT, tab),
    closeOther: (tab: Tab) => handleTabActions(TableActionEnum.CLOSE_OTHER, tab),
  };
};
