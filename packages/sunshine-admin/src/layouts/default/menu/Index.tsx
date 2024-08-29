import React, { CSSProperties } from 'react';
import { useCreation } from 'ahooks';
import classNames from 'classnames';

import { AppLogo } from '@/components/Application';
import { ScrollContainer } from '@/components/Container';
import { BasicMenu } from '@/components/Menu';
import { SimpleMenu } from '@/components/SimpleMenu';
import { ThemeEnum } from '@/enums/appEnum';
import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useGo } from '@/hooks/web/usePage';
import { useAppStore } from '@/stores/modules/app';
import { openWindow } from '@/utils';
import { isHttpUrl } from '@/utils/is';

import { useSplitMenu } from './useSplitMenu';

import './Index.less';

import { Nullable } from '#/global';

interface IProps {
  theme?: ThemeEnum;
  splitType?: MenuSplitTyeEnum;
  isHorizontal?: boolean;
  menuMode?: Nullable<MenuModeEnum>;
}

const Index: React.FC<IProps> = (props) => {
  const { theme, splitType = MenuSplitTyeEnum.NONE, isHorizontal = false, menuMode = null } = props;

  const go = useGo();
  const menuSetting = useMenuSetting();
  const { showLogo } = useRootSetting();
  const { prefixCls } = useDesign('layout-menu');
  const isMobile = useAppStore((state) => state.isMobile);
  const { menus } = useSplitMenu(splitType);
  const _menuMode = isMobile ? MenuModeEnum.INLINE : menuMode || menuSetting.mode;
  const _showLogo = showLogo && menuSetting.isSidebarType;

  const useScroll =
    (!menuSetting.isHorizontal && menuSetting.isSidebarType) ||
    [MenuSplitTyeEnum.LEFT, MenuSplitTyeEnum.NONE].includes(splitType);

  const wrapperStyle = useCreation<CSSProperties>(() => {
    return {
      height: `calc(100% - ${_showLogo ? '48px' : '0px'})`,
    };
  }, [_showLogo]);

  const logoClass = classNames(`${prefixCls}-logo ${theme}`, {
    [`${prefixCls}--mobile`]: isMobile,
  });

  /**
   * before click menu
   * @param menu
   */
  const beforeMenuClickFn = async (path: string) => {
    if (!isHttpUrl(path)) {
      return true;
    }
    openWindow(path);
    return false;
  };

  const handleMenuClick = (path: string) => {
    go(path);
  };

  const commonProps = useCreation(() => {
    return {
      menus,
      beforeClickFn: beforeMenuClickFn,
      items: menus,
      theme: theme,
      accordion: menuSetting.accordion,
      collapse: menuSetting.collapsed,
      collapsedShowTitle: menuSetting.collapsedShowTitle,
      onMenuClick: handleMenuClick,
    };
  }, [menus, menuSetting]);

  function renderHeader() {
    if (!showLogo && !isMobile) return null;
    return <AppLogo showTitle={!menuSetting.collapsed} className={logoClass} theme={theme} />;
  }

  const renderMenu = () => {
    const { menus, ...menuProps } = commonProps;
    if (!menus || !menus.length) return null;
    return !isHorizontal ? (
      <SimpleMenu {...menuProps} isSplitMenu={menuSetting.split} items={menus} />
    ) : (
      <BasicMenu
        {...(menuProps as any)}
        isHorizontal={isHorizontal}
        type={menuSetting.type}
        mode={_menuMode}
        items={menus}
      />
    );
  };

  return (
    <>
      {renderHeader()}
      {useScroll ? (
        <ScrollContainer style={wrapperStyle}>{renderMenu()}</ScrollContainer>
      ) : (
        renderMenu()
      )}
    </>
  );
};

export default Index;
