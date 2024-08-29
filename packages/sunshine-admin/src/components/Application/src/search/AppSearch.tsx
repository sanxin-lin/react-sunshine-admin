import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import { useLocale } from '@/hooks/web/useLocale';

import AppSearchModal from './AppSearchModal';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const AppSearch = (props: IProps) => {
  const { className, ...wrapperProps } = props;
  const { t } = useLocale();
  const [showModal, setShowModal] = useState(false);
  const changeModal = (show: boolean) => {
    setShowModal(show);
  };
  return (
    <>
      <div {...wrapperProps} className={`p-1 ${className}`} onClick={() => changeModal(true)}>
        <Tooltip title={t('common.searchText')}>
          <SearchOutlined />
        </Tooltip>
      </div>
      <AppSearchModal onClose={() => changeModal(false)} visible={showModal} />
    </>
  );
};

export default AppSearch;
