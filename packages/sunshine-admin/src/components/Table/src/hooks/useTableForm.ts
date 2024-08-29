import { Recordable } from '#/global';
import { useCreation } from 'ahooks';
import { BasicTableProps, FetchParams } from '../types/table';
import type { FormProps } from '@/components/Form';
import { isFunction } from 'lodash-es';

export const useTableForm = (
  props: BasicTableProps,
  fetch: (opt?: FetchParams | undefined) => Promise<Recordable<any>[] | undefined>,
  loading: boolean | undefined,
) => {
  const { handleSearchInfoFn, formConfig } = props;
  const formPropsCreation = useCreation((): Partial<FormProps> => {
    const { submitButtonOptions } = formConfig || {};
    return {
      showAdvancedButton: true,
      ...formConfig,
      submitButtonOptions: { loading: loading, ...submitButtonOptions },
      compact: true,
    };
  }, [formConfig]);

  function handleSearchInfoChange(info: Recordable) {
    if (handleSearchInfoFn && isFunction(handleSearchInfoFn)) {
      info = handleSearchInfoFn(info) || info;
    }
    fetch({ searchInfo: info, page: 1 });
  }

  return {
    formProps: formPropsCreation as FormProps,
    handleSearchInfoChange,
  };
};
