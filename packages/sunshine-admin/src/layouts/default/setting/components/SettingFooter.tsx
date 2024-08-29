import { CopyOutlined, RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useUpdateTheme } from '@/hooks/setting/useUpdateTheme';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useMessage } from '@/hooks/web/useMessage';
import defaultSetting from '@/settings/projectSetting';
import { useAppStore, useAppStoreActions } from '@/stores/modules/app';
import { useMultipleTabStoreActions } from '@/stores/modules/multipleTab';
import { usePermissionStoreActions } from '@/stores/modules/permission';
import { useUserStoreActions } from '@/stores/modules/user';
import { updateColorWeak } from '@/theme/updateColorWeak';
import { updateGrayMode } from '@/theme/updateGrayMode';
import { copyText } from '@/utils/copyTextToClipboard';

import './SettingFooter.less';

const SettingFooter = () => {
  const { resetState: resetPermission } = usePermissionStoreActions();
  const { resetAllState: resetApp, setProjectConfig } = useAppStoreActions();
  const { resetState: resetMultipleTab } = useMultipleTabStoreActions();
  const { resetState: resetUser } = useUserStoreActions();
  const { updateSidebarBgColor } = useUpdateTheme();
  const projectSetting = useAppStore((state) => state.getProjectConfig());
  const { createSuccessModal, createMessage } = useMessage();
  const { t } = useLocale();
  const { prefixCls } = useDesign('setting-footer');

  const handleCopy = () => {
    copyText(JSON.stringify(projectSetting, null, 2), null).then(() => {
      createSuccessModal({
        title: t('layout.setting.operatingTitle'),
        content: t('layout.setting.operatingContent'),
      });
    });
  };

  const handleResetSetting = () => {
    try {
      setProjectConfig(defaultSetting);
      const { colorWeak, grayMode } = defaultSetting;
      updateSidebarBgColor();
      updateColorWeak(colorWeak);
      updateGrayMode(grayMode);
      createMessage.success(t('layout.setting.resetSuccess'));
    } catch (error: any) {
      createMessage.error(error);
    }
  };

  const handleClearAndRedo = () => {
    localStorage.clear();
    resetPermission();
    resetApp();
    resetMultipleTab();
    resetUser();
    location.reload();
  };

  return (
    <div className={prefixCls}>
      <Button type="primary" block onClick={handleCopy}>
        <CopyOutlined className="mr-2" />
        {t('layout.setting.copyBtn')}
      </Button>

      <Button type="primary" block onClick={handleResetSetting} className="my-3">
        <RedoOutlined className="mr-2" />
        {t('common.resetText')}
      </Button>

      <Button type="primary" danger block onClick={handleClearAndRedo}>
        <RedoOutlined className="mr-2" />
        {t('layout.setting.clearBtn')}
      </Button>
    </div>
  );
};

export default SettingFooter;
