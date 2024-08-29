import React from 'react';
import classNames from 'classnames';

import LogoImg from '@/assets/images/logo.png';
import { PageEnum } from '@/enums/pageEnum';
import { useGlobSetting } from '@/hooks/setting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useGo } from '@/hooks/web/usePage';
import { useUserStore } from '@/stores/modules/user';

import './AppLogo.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {
  /**
   * The theme of the current parent component
   */
  theme?: 'light' | 'dark';
  /**
   * Whether to show title
   */
  showTitle?: boolean;
  /**
   * The title is also displayed when the menu is collapsed
   */
  alwaysShowTitle?: boolean;
}

const AppLogo: React.FC<IProps> = (props) => {
  const {
    theme = '',
    showTitle = true,
    alwaysShowTitle = false,
    className = '',
    ...wrapperProps
  } = props;
  const { collapsedShowTitle } = useMenuSetting();
  const { prefixCls } = useDesign('app-logo');
  const { title } = useGlobSetting();
  const token = useUserStore((state) => state.getToken());
  const userInfo = useUserStore((state) => state.getUserInfo());
  const go = useGo();
  const appLogoClass = classNames(`anticon ${prefixCls} ${theme} ${className}`, {
    'collapsed-show-title': collapsedShowTitle,
  });
  const titleClass = classNames(`ml-2 truncate md:opacity-100 ${prefixCls}__title`, {
    'xs:opacity-0': !alwaysShowTitle,
    hidden: !showTitle,
  });
  const goHome = () => {
    if (token) {
      go(userInfo.homePath || PageEnum.BASE_HOME);
    }
  };

  return (
    <div {...wrapperProps} className={appLogoClass} onClick={goHome}>
      <img src={LogoImg} />
      <div className={titleClass}>{title}</div>
    </div>
  );
};

export default AppLogo;
