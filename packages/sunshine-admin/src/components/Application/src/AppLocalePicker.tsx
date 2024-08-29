import React, { useEffect, useState } from 'react';
import { useCreation } from 'ahooks';

import type { DropMenu } from '@/components/Dropdown';
import { Dropdown } from '@/components/Dropdown';
import { Icon } from '@/components/Icon';
import { useLocale } from '@/hooks/web/useLocale';
import { localeList } from '@/settings/localeSetting';

import './AppLocalePicker.less';

import { BaseProps } from '#/compoments';
import type { LocaleType } from '#/config';

interface IProps extends BaseProps {
  /**
   * Whether to display text
   */
  showText?: boolean;
  /**
   * Whether to refresh the interface when changing
   */
  reload?: boolean;
}

const AppLocalePicker: React.FC<IProps> = (props) => {
  const { showText = true, reload, className = '' } = props;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { changeLocale, locale } = useLocale();

  const localeText = useCreation(() => {
    const key = selectedKeys[0];
    if (!key) {
      return '';
    }
    return localeList.find((item) => item.event === key)?.text;
  }, [selectedKeys]);

  useEffect(() => {
    setSelectedKeys([locale]);
  }, [locale]);

  const toggleLocale = async (locale: LocaleType) => {
    await changeLocale(locale);
    setSelectedKeys([locale]);
    reload && location.reload();
  };
  const handleMenuEvent = (menu: DropMenu) => {
    if (locale === menu.event) return;
    toggleLocale(menu.event as LocaleType);
  };

  return (
    <Dropdown
      placement="bottom"
      trigger={['click']}
      dropMenuList={localeList}
      selectedKeys={selectedKeys}
      menuEvent={handleMenuEvent}
      overlayClassName="app-locale-picker-overlay"
      className={className}
    >
      <span className="cursor-pointer flex items-center">
        <Icon icon="ion:language" />
        {showText && <span className="ml-1">{localeText}</span>}
      </span>
    </Dropdown>
  );
};

export default AppLocalePicker;
