import type { SizeType } from '../../types/table';
import { Tooltip, Dropdown, type MenuProps, TooltipProps } from 'antd';
import { ColumnHeightOutlined } from '@ant-design/icons';
import { useLocale } from '@/hooks/web/useLocale';
import { getPopupContainer } from '@/utils/dom';
import { useTableContextSelctor } from '../../hooks/useTableContext';
import { useState } from 'react';
import { useCreation } from 'ahooks';

const SizeSetting = (props: TooltipProps) => {
  const { setProps, getSize } = useTableContextSelctor((state) => ({
    setProps: state.setProps,
    getSize: state.getSize,
  }));
  const { t } = useLocale();
  const [selectedKeys, setSelectedKeys] = useState([getSize()]);
  const handleTitleClick: MenuProps['onClick'] = ({ key }) => {
    setSelectedKeys([key as SizeType]);

    setProps({
      size: key as SizeType,
    });
  };

  const menuProps = useCreation<MenuProps>(() => {
    return {
      onClick: handleTitleClick,
      selectedKeys,
      items: [
        {
          key: 'default',
          label: t('component.table.settingDensDefault'),
        },
        {
          key: 'middle',
          label: t('component.table.settingDensMiddle'),
        },
        {
          key: 'small',
          label: t('component.table.settingDensSmall'),
        },
      ],
    };
  }, [t, selectedKeys]);

  return (
    <Tooltip placement="top" title={t('component.table.settingDens')} {...props}>
      <Dropdown
        placement="bottom"
        menu={menuProps}
        trigger={['click']}
        getPopupContainer={getPopupContainer}
      >
        <ColumnHeightOutlined />
      </Dropdown>
    </Tooltip>
  );
};

export default SizeSetting;
