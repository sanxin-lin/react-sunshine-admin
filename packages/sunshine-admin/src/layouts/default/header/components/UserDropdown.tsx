import { useCreation } from 'ahooks';
import { Dropdown, MenuProps } from 'antd';

import headerImg from '@/assets/images/header.jpg';
import { Icon } from '@/components/Icon';
import { useModal } from '@/components/Modal';
import { ThemeEnum } from '@/enums/appEnum';
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useMessage } from '@/hooks/web/useMessage';
import { DOC_URL } from '@/settings/siteSetting';
import { useUserStore, useUserStoreActions } from '@/stores/modules/user';
import { openWindow } from '@/utils';

import ChangeApi from './ChangeApi';
import LockModal from './LockModal';

import './UserDropdown.less';

// type MenuEvent = 'logout' | 'doc' | 'lock' | 'api';

interface IProps {
  theme?: ThemeEnum;
}

const UserDropdown = (props: IProps) => {
  const { theme } = props;

  const userInfo = useUserStore((state) => state.getUserInfo());
  const { logout } = useUserStoreActions();
  const { prefixCls } = useDesign('header-user-dropdown');
  const { t } = useLocale();
  const { showDoc, useLockPage, showApi } = useHeaderSetting();

  const { createConfirm } = useMessage();

  const _userInfo = useCreation(() => {
    const { realName = '', avatar, desc } = userInfo || {};
    return { realName, avatar: avatar || headerImg, desc };
  }, [userInfo]);

  const [register, { openModal }] = useModal();
  const [registerApi, { openModal: openApiModal }] = useModal();

  const handleLock = () => {
    openModal(true);
  };

  const handleApi = () => {
    openApiModal(true, {});
  };

  //  login out
  const handleLoginOut = () => {
    createConfirm({
      iconType: 'warning',
      title: t('sys.app.logoutTip'),
      content: t('sys.app.logoutMessage'),
      onOk: async () => {
        // 主动登出，不带redirect地址
        await logout(true);
      },
    });
  };

  // open doc
  const openDoc = () => {
    openWindow(DOC_URL);
  };

  const items = useCreation((): MenuProps['items'] => {
    const _items: MenuProps['items'] = [];
    if (showDoc) {
      _items.push(
        {
          label: t('layout.header.dropdownItemDoc'),
          key: 'doc',
          icon: <Icon icon="ion:document-text-outline" />,
          onClick: openDoc,
        },
        {
          type: 'divider',
        },
      );
    }
    if (showApi) {
      _items.push({
        label: t('layout.header.dropdownChangeApi'),
        key: 'api',
        icon: <Icon icon="ant-design:swap-outlined" />,
        onClick: handleApi,
      });
    }
    if (useLockPage) {
      _items.push({
        label: t('layout.header.tooltipLock'),
        key: 'lock',
        icon: <Icon icon="ant-design:swap-outlined" />,
        onClick: handleLock,
      });
    }
    _items.push({
      label: t('layout.header.dropdownItemLoginOut'),
      key: 'logout',
      icon: <Icon icon="ion:power-outline" />,
      onClick: handleLoginOut,
    });

    return _items;
  }, [showDoc, showApi, useLockPage]);

  const menuProps = useCreation((): MenuProps => {
    return {
      // onClick: handleMenuClick,
      items,
    };
  }, [items]);

  return (
    <>
      <Dropdown
        placement="bottomLeft"
        overlayClassName={`${prefixCls}-dropdown-overlay`}
        menu={menuProps}
      >
        <span className={`${prefixCls} ${prefixCls}--${theme} flex`}>
          <img className={`${prefixCls}__header`} src={_userInfo.avatar} />
          <span className={`${prefixCls}__info hidden md:block`}>
            <span className={`${prefixCls}__name truncate`}>{_userInfo.realName}</span>
          </span>
        </span>
      </Dropdown>
      <LockModal register={register} />
      <ChangeApi register={registerApi} />
    </>
  );
};

export default UserDropdown;
