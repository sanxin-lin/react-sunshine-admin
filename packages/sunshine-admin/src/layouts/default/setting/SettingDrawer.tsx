import { Divider } from 'antd';

import { AppThemeToggle } from '@/components/Application';
import { BasicDrawer, DrawerProps } from '@/components/Drawer';
import { MenuTypeEnum, TriggerEnum } from '@/enums/menuEnum';
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
import { useLocale } from '@/hooks/web/useLocale';
import { SIDE_BAR_BG_COLOR_LIST } from '@/settings/designSetting';

import InputNumberItem from './components/InputNumberItem';
import SelectItem from './components/SelectItem';
import SettingFooter from './components/SettingFooter';
import SwitchItem from './components/SwitchItem';
import ThemeColorPicker from './components/ThemeColorPicker';
import TypePicker from './components/TypePicker';
import { HandlerEnum, useSettingEnums } from './enum';

interface IProps extends Partial<DrawerProps> {}

const SettingDrawer = (props: IProps) => {
  const { t } = useLocale();
  const {
    contentMode,
    showFooter,
    showBreadCrumb,
    showBreadCrumbIcon,
    showLogo,
    fullContent,
    colorWeak,
    grayMode,
    lockTime,
    showThemeModeToggle,
  } = useRootSetting();

  const {
    openPageLoading,
    basicTransition,
    enable: enableTransition,
    openNProgress,
  } = useTransitionSetting();

  const {
    isHorizontal,
    show: showMenu,
    type: menuType,
    trigger: menuTrigger,
    collapsedShowTitle,
    fixed: menuFixed,
    collapsed,
    canDrag,
    topMenuAlign,
    accordion,
    menuWidth,
    bgColor: menuBgColor,
    isTopMenu,
    split,
    isMixSidebar,
    closeMixSidebarOnChange,
    mixSideTrigger,
    mixSideFixed,
  } = useMenuSetting();

  const { show: showHeader, fixed: headerFixed, showSearch } = useHeaderSetting();

  const {
    show: showMultipleTab,
    showQuick,
    showRedo,
    showFold,
    autoCollapse,
  } = useMultipleTabSetting();

  const showMenuState = showMenu && !isHorizontal;

  const {
    menuTypeListEnum,
    getMenuTriggerOptions,
    contentModeOptions,
    topMenuAlignOptions,
    routerTransitionOptions,
    mixSidebarTriggerOptions,
  } = useSettingEnums();

  const renderSidebar = () => {
    return (
      <>
        <TypePicker menuTypeList={menuTypeListEnum} def={menuType} />
      </>
    );
  };

  const renderSideBarTheme = () => {
    return (
      <ThemeColorPicker
        colorList={SIDE_BAR_BG_COLOR_LIST}
        def={menuBgColor}
        event={HandlerEnum.MENU_THEME}
      />
    );
  };

  const renderFeatures = () => {
    let triggerDef = menuTrigger;
    const triggerOptions = getMenuTriggerOptions(split);
    const some = triggerOptions.some((item) => item.value === triggerDef);
    if (!some) {
      triggerDef = TriggerEnum.FOOTER;
    }

    return (
      <>
        <SwitchItem
          title={t('layout.setting.splitMenu')}
          event={HandlerEnum.MENU_SPLIT}
          def={split}
          disabled={!showMenuState || menuType !== MenuTypeEnum.MIX}
        />
        <SwitchItem
          title={t('layout.setting.mixSidebarFixed')}
          event={HandlerEnum.MENU_FIXED_MIX_SIDEBAR}
          def={mixSideFixed}
          disabled={!isMixSidebar}
        />

        <SwitchItem
          title={t('layout.setting.closeMixSidebarOnChange')}
          event={HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE}
          def={closeMixSidebarOnChange}
          disabled={!isMixSidebar}
        />
        <SwitchItem
          title={t('layout.setting.menuCollapse')}
          event={HandlerEnum.MENU_COLLAPSED}
          def={collapsed}
          disabled={!showMenuState}
        />

        <SwitchItem
          title={t('layout.setting.menuDrag')}
          event={HandlerEnum.MENU_HAS_DRAG}
          def={canDrag}
          disabled={!showMenuState}
        />
        <SwitchItem
          title={t('layout.setting.menuSearch')}
          event={HandlerEnum.HEADER_SEARCH}
          def={showSearch}
          disabled={!showHeader}
        />
        <SwitchItem
          title={t('layout.setting.menuAccordion')}
          event={HandlerEnum.MENU_ACCORDION}
          def={accordion}
          disabled={!showMenuState}
        />

        <SwitchItem
          title={t('layout.setting.collapseMenuDisplayName')}
          event={HandlerEnum.MENU_COLLAPSED_SHOW_TITLE}
          def={collapsedShowTitle}
          disabled={!showMenuState || !collapsed || isMixSidebar}
        />

        <SwitchItem
          title={t('layout.setting.fixedHeader')}
          event={HandlerEnum.HEADER_FIXED}
          def={headerFixed}
          disabled={!showHeader}
        />
        <SwitchItem
          title={t('layout.setting.fixedSideBar')}
          event={HandlerEnum.MENU_FIXED}
          def={menuFixed}
          disabled={!showMenuState || isMixSidebar}
        />
        <SwitchItem
          title={t('layout.setting.autoCollapseTabsInFold')}
          event={HandlerEnum.TABS_AUTO_COLLAPSE}
          def={autoCollapse}
          disabled={!showMultipleTab}
        />
        <SelectItem
          title={t('layout.setting.mixSidebarTrigger')}
          event={HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR}
          def={mixSideTrigger}
          options={mixSidebarTriggerOptions}
          disabled={!isMixSidebar}
        />
        <SelectItem
          title={t('layout.setting.topMenuLayout')}
          event={HandlerEnum.MENU_TOP_ALIGN}
          def={topMenuAlign}
          options={topMenuAlignOptions}
          disabled={!showHeader || split || (!isTopMenu && !split) || isMixSidebar}
        />
        <SelectItem
          title={t('layout.setting.menuCollapseButton')}
          event={HandlerEnum.MENU_TRIGGER}
          def={triggerDef}
          options={triggerOptions}
          disabled={!showMenuState || isMixSidebar}
        />
        <SelectItem
          title={t('layout.setting.contentMode')}
          event={HandlerEnum.CONTENT_MODE}
          def={contentMode}
          options={contentModeOptions}
        />
        <InputNumberItem
          title={t('layout.setting.autoScreenLock')}
          min={0}
          event={HandlerEnum.LOCK_TIME}
          defaultValue={lockTime}
          formatter={
            ((value: string) => {
              return parseInt(value) === 0
                ? `0(${t('layout.setting.notAutoScreenLock')})`
                : `${value}${t('layout.setting.minute')}`;
            }) as any
          }
        />
        <InputNumberItem
          title={t('layout.setting.expandedMenuWidth')}
          max={600}
          min={100}
          step={10}
          event={HandlerEnum.MENU_WIDTH}
          disabled={!showMenuState}
          defaultValue={menuWidth}
          formatter={((value: string) => `${parseInt(value)}px`) as any}
        />
      </>
    );
  };

  const renderContent = () => {
    return (
      <>
        <SwitchItem
          title={t('layout.setting.breadcrumb')}
          event={HandlerEnum.SHOW_BREADCRUMB}
          def={showBreadCrumb}
          disabled={!showHeader}
        />

        <SwitchItem
          title={t('layout.setting.breadcrumbIcon')}
          event={HandlerEnum.SHOW_BREADCRUMB_ICON}
          def={showBreadCrumbIcon}
          disabled={!showHeader}
        />

        <SwitchItem
          title={t('layout.setting.tabs')}
          event={HandlerEnum.TABS_SHOW}
          def={showMultipleTab}
        />

        <SwitchItem
          title={t('layout.setting.tabsRedoBtn')}
          event={HandlerEnum.TABS_SHOW_REDO}
          def={showRedo}
          disabled={!showMultipleTab}
        />

        <SwitchItem
          title={t('layout.setting.tabsQuickBtn')}
          event={HandlerEnum.TABS_SHOW_QUICK}
          def={showQuick}
          disabled={!showMultipleTab}
        />
        <SwitchItem
          title={t('layout.setting.tabsFoldBtn')}
          event={HandlerEnum.TABS_SHOW_FOLD}
          def={showFold}
          disabled={!showMultipleTab}
        />

        <SwitchItem
          title={t('layout.setting.sidebar')}
          event={HandlerEnum.MENU_SHOW_SIDEBAR}
          def={showMenu}
          disabled={isHorizontal}
        />

        <SwitchItem
          title={t('layout.setting.header')}
          event={HandlerEnum.HEADER_SHOW}
          def={showHeader}
        />
        <SwitchItem
          title="Logo"
          event={HandlerEnum.SHOW_LOGO}
          def={showLogo}
          disabled={isMixSidebar}
        />
        <SwitchItem
          title={t('layout.setting.footer')}
          event={HandlerEnum.SHOW_FOOTER}
          def={showFooter}
        />
        <SwitchItem
          title={t('layout.setting.fullContent')}
          event={HandlerEnum.FULL_CONTENT}
          def={fullContent}
        />

        <SwitchItem
          title={t('layout.setting.grayMode')}
          event={HandlerEnum.GRAY_MODE}
          def={grayMode}
        />

        <SwitchItem
          title={t('layout.setting.colorWeak')}
          event={HandlerEnum.COLOR_WEAK}
          def={colorWeak}
        />
      </>
    );
  };

  const renderTransition = () => {
    return (
      <>
        <SwitchItem
          title={t('layout.setting.progress')}
          event={HandlerEnum.OPEN_PROGRESS}
          def={openNProgress}
        />
        <SwitchItem
          title={t('layout.setting.switchLoading')}
          event={HandlerEnum.OPEN_PAGE_LOADING}
          def={openPageLoading}
        />

        <SwitchItem
          title={t('layout.setting.switchAnimation')}
          event={HandlerEnum.OPEN_ROUTE_TRANSITION}
          def={enableTransition}
        />

        <SelectItem
          title={t('layout.setting.animationType')}
          event={HandlerEnum.ROUTER_TRANSITION}
          def={basicTransition}
          options={routerTransitionOptions}
          disabled={!enableTransition}
        />
      </>
    );
  };

  return (
    <BasicDrawer
      {...(props as any)}
      title={t('layout.setting.drawerTitle')}
      width={330}
      class="setting-drawer"
    >
      {showThemeModeToggle && <Divider>{t('layout.setting.themeMode')}</Divider>}
      {showThemeModeToggle && <AppThemeToggle className="mx-auto" />}
      <Divider>{t('layout.setting.navMode')}</Divider>
      {renderSidebar()}
      <Divider>{t('layout.setting.sidebarTheme')}</Divider>
      {renderSideBarTheme()}
      <Divider>{t('layout.setting.interfaceFunction')}</Divider>
      {renderFeatures()}
      <Divider>{t('layout.setting.interfaceDisplay')}</Divider>
      {renderContent()}
      <Divider>{t('layout.setting.animation')}</Divider>
      {renderTransition()}
      <Divider />
      <SettingFooter />
    </BasicDrawer>
  );
};

export default SettingDrawer;
