import { useState } from 'react';
import { useCreation } from 'ahooks';

function pagination<T = any>(list: T[], pageNo: number, pageSize: number): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  const ret =
    offset + Number(pageSize) >= list.length
      ? list.slice(offset, list.length)
      : list.slice(offset, offset + Number(pageSize));
  return ret;
}

export function usePagination<T = any>(list: T[], inputPageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(inputPageSize);

  const paginationList = useCreation(() => {
    return pagination(list, currentPage, pageSize);
  }, [list, currentPage, pageSize]);

  const total = list.length;

  function setCurrentPageFn(page: number) {
    setCurrentPage(page);
  }

  function setPageSizeFn(pageSize: number) {
    setPageSize(pageSize);
  }

  return {
    setCurrentPage: setCurrentPageFn,
    total,
    setPageSize: setPageSizeFn,
    paginationList,
  };
}
