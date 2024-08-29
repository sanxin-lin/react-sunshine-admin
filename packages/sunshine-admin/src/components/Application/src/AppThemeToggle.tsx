import classNames from 'classnames';

import { SvgIcon } from '@/components/Icon';
import { ThemeEnum } from '@/enums/appEnum';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useDesign } from '@/hooks/web/useDesign';

import './AppThemeToggle.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}
const AppThemeToggle: React.FC<IProps> = (props) => {
  const { className = '', ...wrapperProps } = props;
  const { prefixCls } = useDesign('dark-switch');
  const {
    themeMode,
    setThemeMode,
    showThemeModeToggle,
    updateHeaderBgColor,
    updateRootTheme,
    updateSidebarBgColor,
  } = useRootSetting();
  const isDark = themeMode === ThemeEnum.DARK;

  const containerClassNames = classNames(`${prefixCls} ${className}`, {
    [`${prefixCls}--dark`]: isDark,
  });

  function toggleDarkMode() {
    const mode = themeMode === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
    setThemeMode(mode);
    updateRootTheme(mode);
    updateHeaderBgColor({
      themeMode: mode,
    });
    updateSidebarBgColor({
      themeMode: mode,
    });
  }

  return (
    <>
      {showThemeModeToggle && (
        <div {...wrapperProps} className={containerClassNames} onClick={toggleDarkMode}>
          <div className={`${prefixCls}-inner`}></div>
          <SvgIcon size="14" name="sun" />
          <SvgIcon size="14" name="moon" />
        </div>
      )}
    </>
  );
};

export default AppThemeToggle;
