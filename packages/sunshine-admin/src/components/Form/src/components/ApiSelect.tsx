import { Fn, Recordable } from '#/global';
import { useGetState } from '@/hooks/utils/useGetState';
import { useLocale } from '@/hooks/web/useLocale';
import { LoadingOutlined } from '@ant-design/icons';
import { useCreation } from 'ahooks';
import { Select, SelectProps } from 'antd';
import { cloneDeep, get, isEqual, isFunction, omit } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

type OptionsItem = { label?: string; value?: string; disabled?: boolean; [name: string]: any };

interface IProps {
  //   value?: any[] | string | number | Recordable;
  numberToString?: boolean;
  api?: (arg?: any) => Promise<OptionsItem[] | Recordable<any>>;
  params?: any;
  resultField?: string;
  labelField?: string;
  valueField?: string;
  immediate?: boolean;
  alwaysLoad?: boolean;
  options?: OptionsItem[];
  beforeFetch?: Fn;
  afterFetch?: Fn;
  onOptionsOpen?: (options: OptionsItem[]) => void;
}

const ApiSelect = (props: IProps) => {
  const {
    numberToString,
    api = null,
    params = {},
    resultField = '',
    labelField = 'label',
    valueField = 'value',
    immediate = true,
    alwaysLoad = false,
    options = [],
    beforeFetch = null,
    afterFetch = null,
    onOptionsOpen,
    ...restProps
  } = props;

  const [tempOptions, setTempOptions] = useState<OptionsItem[]>([]);
  const isFirstLoaded = useRef(false);
  const [loading, setLoding, getLoading] = useGetState(false);
  const { t } = useLocale();

  const optionsData = useCreation(() => {
    let data = tempOptions.reduce((prev, next: any) => {
      if (next) {
        const value = get(next, valueField);
        prev.push({
          ...omit(next, [labelField, valueField]),
          label: get(next, labelField),
          value: numberToString ? `${value}` : value,
        });
      }
      return prev;
    }, [] as OptionsItem[]);
    return data.length > 0 ? data : options;
  }, [tempOptions]);

  useEffect(() => {
    onOptionsOpen?.(optionsData);
  }, [optionsData]);

  const cacheParams = useRef<any>(null);
  useEffect(() => {
    if (immediate && !isEqual(cacheParams, params)) {
      fetch();
      cacheParams.current = cloneDeep(params);
    }
  }, [immediate, params]);

  const handleFetch = async (visible: boolean) => {
    if (visible) {
      if (alwaysLoad) {
        await fetch();
      } else if (!immediate && !isFirstLoaded.current) {
        await fetch();
      }
    }
  };

  async function fetch() {
    if (!api || !isFunction(api) || getLoading()) return;
    let _tempOptions: OptionsItem[] = [];
    let _params = params;
    try {
      setLoding(true);
      if (beforeFetch && isFunction(beforeFetch)) {
        _params = (await beforeFetch(params)) || params;
      }
      let res = await api(_params);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      isFirstLoaded.current = true;
      if (Array.isArray(res)) {
        _tempOptions = res;
        return;
      } else if (resultField) {
        _tempOptions = get(res, resultField) || [];
      }
    } catch (error) {
      console.warn(error);
      // reset status
      isFirstLoaded.current = false;
    } finally {
      setTempOptions(_tempOptions);
      setLoding(false);
    }
  }
  const loadingProps = useCreation((): SelectProps => {
    if (loading) {
      return {
        suffixIcon: <LoadingOutlined spin />,
        notFoundContent: (
          <span>
            <LoadingOutlined spin className="mr-1" />
            {t('component.form.apiSelectNotFound')}
          </span>
        ),
      };
    }
    return {};
  }, [loading]);
  return <Select onDropdownVisibleChange={handleFetch} {...loadingProps} {...restProps} />;
};

export default ApiSelect;
