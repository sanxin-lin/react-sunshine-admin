import { MenuModeEnum } from '@/enums/menuEnum';
import { useAppStore, useAppStoreActions } from '@/stores/modules/app';

import { useFullContent } from '../web/useFullContent';

import { useMenuSetting } from './useMenuSetting';
import { useRootSetting } from './useRootSetting';

export const useHeaderSetting = () => {
  const { fullContent } = useFullContent();
  const projectConfig = useAppStore((state) => state.getProjectConfig());
  const { setHeaderSetting } = useAppStoreActions();
  const headerSetting = projectConfig.headerSetting;
  const menuSetting = useMenuSetting();
  const { showBreadCrumb, showLogo } = useRootSetting();
  const { show, fixed } = headerSetting;

  const showMixHeader = !menuSetting.isSidebarType && show;
  const showFullHeader =
    !fullContent && showMixHeader && show && !menuSetting.isTopMenu && !menuSetting.isMixSidebar;
  const showInsetHeader = (() => {
    const need = !fullContent && show;
    return (
      (need && !showMixHeader) ||
      (need && menuSetting.isTopMenu) ||
      (need && menuSetting.isMixSidebar)
    );
  })();
  const unFixedAndFull = !fixed && !showFullHeader;
  const showBread =
    menuSetting.mode !== MenuModeEnum.HORIZONTAL && showBreadCrumb && !menuSetting.split;
  const showHeaderLogo = showLogo && !menuSetting.isSidebarType && !menuSetting.isMixSidebar;
  const showContent = showBread || menuSetting.showHeaderTrigger;
  return {
    ...headerSetting,
    showMixHeader,
    showFullHeader,
    showInsetHeader,
    unFixedAndFull,
    showBread,
    showHeaderLogo,
    showContent,
    setHeaderSetting,
  };
};
