import { useLocale } from '@/hooks/web/useLocale';
import { BasicTableProps } from '../types/table';
import { useEffect, useState } from 'react';
import type { PaginationProps } from '../types/pagination';
import { isBoolean } from 'lodash-es';
import { useCreation } from 'ahooks';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../const';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface ItemRender {
  page: number;
  type: 'page' | 'prev' | 'next';
  originalElement: any;
}

const itemRender = ({ page, type, originalElement }: ItemRender) => {
  if (type === 'prev') {
    return page === 0 ? null : <LeftOutlined />;
  } else if (type === 'next') {
    return page === 1 ? null : <RightOutlined />;
  }
  return originalElement;
};

export const usePagination = (pagination: BasicTableProps['pagination']) => {
  const { t } = useLocale();

  const [config, setConfig] = useState({} as PaginationProps);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isBoolean(pagination) && pagination) {
      setConfig((pre) => ({ ...pre, ...pagination }));
    }
  }, [pagination]);

  const paginationInfo = useCreation(() => {
    if (!show || (isBoolean(pagination) && !pagination)) {
      return false;
    }

    return {
      current: 1,
      size: 'small',
      defaultPageSize: PAGE_SIZE,
      showTotal: (total) => t('component.table.total', { total }),
      showSizeChanger: true,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      itemRender: itemRender,
      showQuickJumper: true,
      ...(isBoolean(pagination) ? {} : pagination),
      ...config,
    } as PaginationProps;
  }, [pagination, show, config]);

  const setPagination = (info: Partial<PaginationProps>) => {
    setConfig({
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    });
  };

  const getPaginationInfo = () => {
    return paginationInfo;
  };

  function getShowPagination() {
    return show;
  }

  async function setShowPagination(flag: boolean) {
    setShow(flag);
  }

  return { getPaginationInfo, paginationInfo, setShowPagination, getShowPagination, setPagination };
};
