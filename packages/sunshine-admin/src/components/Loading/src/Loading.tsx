import { SizeEnum } from '@/enums/sizeEnum';
import { useCreation } from 'ahooks';
import { Spin } from 'antd';
import classNames from 'classnames';
import { CSSProperties, RefObject } from 'react';
import { LoadingProps } from './types';
import { Nullable } from '#/global';
import { createRoot } from 'react-dom/client';

import './Loading.less';

const Loading = (props: LoadingProps) => {
  const {
    tip = '',
    size = SizeEnum.LARGE,
    absolute = false,
    loading = false,
    background,
    theme,
    ...restProps
  } = props;

  const wrapperClassNames = classNames('full-loading', {
    absolute,
    theme: !!theme,
  });

  const wrapperStyles = useCreation<CSSProperties>(() => {
    if (!loading)
      return {
        display: 'none',
      };
    if (background)
      return {
        backgroundColor: background,
      };
    return {};
  }, [background, loading]);

  return (
    <div className={wrapperClassNames} style={wrapperStyles}>
      <Spin {...restProps} tip={tip} size={size} spinning={loading}></Spin>
    </div>
  );
};

const renderLoading = (element: any, target?: RefObject<Nullable<HTMLElement>>) => {
  const _target = target?.current ?? document.body;
  const container = document.createElement('div');
  _target.appendChild(container);
  const root = createRoot(container);
  root.render(element);
  const close = () => {
    root.unmount();
    _target.removeChild(container);
  };

  return close;
};

Loading.open = (props: LoadingProps & { target?: RefObject<Nullable<HTMLElement>> }) => {
  const close = renderLoading(<Loading {...props} loading={true} />, props.target);
  return close;
};

export default Loading;
