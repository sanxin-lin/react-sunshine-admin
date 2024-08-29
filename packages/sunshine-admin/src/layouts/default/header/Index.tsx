import { Layout } from 'antd';
import classNames from 'classnames';

import { AppLocalePicker, AppLogo, AppSearch } from '@/components/Application';
import { SettingButtonPositionEnum } from '@/enums/appEnum';
import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useAppStore } from '@/stores/modules/app';

import LayoutMenu from '../menu/Index';
import SettingButton from '../setting/Index';
import LayoutTrigger from '../trigger/Index';

import LayoutBreadcrumb from './components/Breadcrumb';
import { ErrorAction, FullScreen, Notify, UserDropdown } from './components';

import './Index.less';

interface IProps {
  fixed?: boolean;
}

const Index = (props: IProps) => {
  const { fixed } = props;
  const { prefixCls } = useDesign('layout-header');
  const { showTopMenu, showHeaderTrigger, split, isMixMode, menuWidth, isMixSidebar } =
    useMenuSetting();
  const { useErrorHandle, showSettingButton, settingButtonPosition } = useRootSetting();
  const theme = useAppStore((state) => state.getThemeMode());
  const {
    showFullScreen,
    showNotice,
    showContent,
    showBread,
    showHeaderLogo,
    show: showHeader,
    showSearch,
  } = useHeaderSetting();

  const isMobile = useAppStore((state) => state.isMobile);
  const headerClass = classNames(`${prefixCls}`, {
    [`${prefixCls}--fixed`]: fixed,
    [`${prefixCls}--mobile`]: isMobile,
    [`${prefixCls}--${theme}`]: theme,
  });

  const showSetting = (() => {
    if (!showSettingButton) {
      return false;
    }

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return showHeader;
    }
    return settingButtonPosition === SettingButtonPositionEnum.HEADER;
  })();

  const logoWidth = (() => {
    if (!isMixMode || isMobile) {
      return {};
    }
    const width = menuWidth < 180 ? 180 : menuWidth;
    return { width: `${width}px` };
  })();

  const splitType = split ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;

  const menuMode = split ? MenuModeEnum.HORIZONTAL : null;

  return (
    <Layout.Header className={headerClass}>
      <>
        <div className={`${prefixCls}-left`}>
          {(showHeaderLogo || isMobile) && (
            <AppLogo className={`${prefixCls}-logo`} theme={theme} style={logoWidth} />
          )}
          {((showContent && showHeaderTrigger && !split && !isMixSidebar) || isMobile) && (
            <LayoutTrigger theme={theme} sider={false} />
          )}
          {showContent && showBread && <LayoutBreadcrumb theme="gettheme" />}
        </div>
        {showTopMenu && !isMobile && (
          <div className={`${prefixCls}-menu`}>
            <LayoutMenu
              isHorizontal={true}
              theme={theme}
              splitType={splitType}
              menuMode={menuMode}
            />
          </div>
        )}
        <div className={`${prefixCls}-action`}>
          {showSearch && <AppSearch className={`${prefixCls}-action__item`} />}
          {useErrorHandle && <ErrorAction className={`${prefixCls}-action__item error-action`} />}
          {showNotice && <Notify className={`${prefixCls}-action__item notify-item`} />}
          {showFullScreen && <FullScreen className={`${prefixCls}-action__item fullscreen-item`} />}
          <AppLocalePicker reload={true} showText={false} className={`${prefixCls}-action__item`} />
          <UserDropdown theme={theme} />
          {showSetting && <SettingButton className={`${prefixCls}-action__item`} />}
        </div>
      </>
    </Layout.Header>
  );
};

export default Index;
