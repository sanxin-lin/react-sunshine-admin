import { Fn, Recordable } from '#/global';
import { useLocale } from '@/hooks/web/useLocale';
import { useCreation, useMount } from 'ahooks';
import { Cascader, CascaderProps } from 'antd';
import { get, isFunction, omit } from 'lodash-es';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

interface Option {
  value?: string;
  label?: string;
  loading?: boolean;
  isLeaf?: boolean;
  children?: Option[];
  [key: string]: any;
}

interface IProps {
  value?: any[];
  api?: (arg?: any) => Promise<Option[] | Recordable<any>>;
  numberToString?: boolean;
  resultField?: string;
  labelField?: string;
  valueField?: string;
  childrenField?: string;
  apiParamKey?: string;
  immediate?: boolean;
  initFetchParams?: Recordable<any>;
  isLeaf?: (arg: Recordable<any>) => boolean;
  //   displayRenderArray?: any[];
  beforeFetch?: Fn;
  afterFetch?: Fn;
  onChange?: (v: any) => void;
}

const ApiCascader = (props: IProps) => {
  const {
    api = null,
    numberToString,
    resultField = '',
    labelField = 'label',
    valueField = 'value',
    childrenField = 'children',
    apiParamKey = 'parentCode',
    immediate = true,
    initFetchParams = {},
    isLeaf = null,
    // displayRenderArray,
    beforeFetch = null,
    afterFetch = null,
    ...restProps
  } = props;

  const [apiData, setApiData] = useState<any[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const { t } = useLocale();

  useEffect(() => {
    const opts = generatorOptions(apiData);
    setOptions(opts);
  }, [apiData]);

  useMount(() => {
    immediate && fetch();
  });

  //   const handleRenderDisplay: CascaderProps['displayRender'] = (labels, selectedOptions) => {
  //     if (unref(emitData).length === selectedOptions?.length) {
  //       return labels.join(' / ');
  //     }
  //     if (isArray(displayRenderArray)) {
  //       return displayRenderArray.join(' / ');
  //     }
  //     return '';
  //   };

  const generatorOptions = (options: any[]): Option[] => {
    return options.reduce((prev, next: Recordable<any>) => {
      if (next) {
        const value = next[valueField];
        const item = {
          ...omit(next, [labelField, valueField]),
          label: next[labelField],
          value: numberToString ? `${value}` : value,
          isLeaf: isFunction(isLeaf) ? isLeaf(next) : false,
        };
        const children = Reflect.get(next, childrenField);
        if (children) {
          Reflect.set(item, childrenField, generatorOptions(children));
        }
        prev.push(item);
      }
      return prev;
    }, [] as Option[]);
  };

  async function fetch() {
    if (!api || !isFunction(api)) return;
    let _apiData: any[] = [];
    setLoading(true);
    try {
      let _initFetchParams = initFetchParams;
      if (beforeFetch && isFunction(beforeFetch)) {
        _initFetchParams = (await beforeFetch(initFetchParams)) || initFetchParams;
      }
      let res = await api(_initFetchParams);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        _apiData = res;
      } else if (resultField) {
        _apiData = get(res, resultField) || [];
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setApiData(_apiData);
      setLoading(false);
    }
  }

  const loadData: CascaderProps['loadData'] = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    if (!api || !isFunction(api)) return;
    try {
      let param = {
        [apiParamKey]: Reflect.get(targetOption, 'value'),
      };
      if (beforeFetch && isFunction(beforeFetch)) {
        param = (await beforeFetch(param)) || param;
      }
      let res = await api(param);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        const children = generatorOptions(res);
        targetOption.children = children;
        return;
      }
      if (resultField) {
        const children = generatorOptions(get(res, resultField) || []);
        targetOption.children = children;
      }
    } catch (e) {
      console.error(e);
    } finally {
      targetOption.loading = false;
    }
  };
  const loadingProps = useCreation((): CascaderProps => {
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
  return (
    <Cascader
      options={options}
      loadData={loadData}
      changeOnSelect
      {...loadingProps}
      {...restProps}
    />
  );
};

export default ApiCascader;
