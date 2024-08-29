import { SettingButtonPositionEnum } from '@/enums/appEnum';
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useDesign } from '@/hooks/web/useDesign';
// import { useUserStore } from '@/stores/modules/user';
import LayoutLockPage from '@/views/sys/lock/Index';

import SettingDrawer from '../setting/SettingDrawer';

import './Index.less';

const Index = () => {
  const { prefixCls } = useDesign('setting-drawer-feature');
  const { showSettingButton, settingButtonPosition, fullContent } = useRootSetting();
  const { show: showHeader } = useHeaderSetting();
  const { show: showMultipleTab } = useMultipleTabSetting();
  const isFixedSettingDrawer = (() => {
    if (!showSettingButton) {
      return false;
    }

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return !showHeader || fullContent;
    }
    return settingButtonPosition === SettingButtonPositionEnum.FIXED;
  })();
  return (
    <>
      <LayoutLockPage />
      {isFixedSettingDrawer && (!showMultipleTab || fullContent) && (
        <SettingDrawer class={prefixCls} />
      )}
      {/* TODO SessionTimeoutLogin */}
      {/* <SessionTimeoutLogin v-if="getIsSessionTimeout" /> */}
    </>
  );
};

export default Index;
