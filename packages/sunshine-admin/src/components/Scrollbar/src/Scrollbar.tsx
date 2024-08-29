import { CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useMount, useReactive, useUnmount } from 'ahooks';
import classNames from 'classnames';

import componentSetting from '@/settings/componentSetting';
import { addResizeListener, nextTick, removeResizeListener } from '@/utils/dom';

import Bar from './Bar';

import './Scrollbar.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {
  native?: boolean;
  wrapStyle?: CSSProperties;
  wrapClassName?: string;
  viewClassName?: string;
  viewStyle?: CSSProperties;
  // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  noresize?: boolean;
  // 用于监控内部scrollHeight的变化
  scrollHeight?: number;
}

const Scrollbar = forwardRef((props: IProps, ref) => {
  const {
    native = componentSetting.scrollbar.native ?? false,
    wrapStyle = {},
    wrapClassName = '',
    viewClassName = '',
    viewStyle = {},
    noresize,
    scrollHeight = 0,
    children,
    className = '',
    ...wrapperProps
  } = props;

  const wrap = useRef<HTMLDivElement>(null);
  const resize = useRef<HTMLDivElement>(null);
  const state = useReactive({
    sizeWidth: '0',
    sizeHeight: '0',
    moveX: 0,
    moveY: 0,
  });

  useImperativeHandle(ref, () => ({
    wrap,
  }));

  const onScroll = () => {
    const _wrap = wrap.current;
    if (!native && _wrap) {
      state.moveY = (_wrap.scrollTop * 100) / _wrap.clientHeight;
      state.moveX = (_wrap.scrollLeft * 100) / _wrap.clientWidth;
    }
  };

  const update = () => {
    const _wrap = wrap.current;
    if (!_wrap) return;

    const heightPercentage = (_wrap.clientHeight * 100) / _wrap.scrollHeight;
    const widthPercentage = (_wrap.clientWidth * 100) / _wrap.scrollWidth;

    state.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : '';
    state.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : '';
  };

  useEffect(() => {
    if (native) return;
    update();
  }, [scrollHeight]);

  useMount(() => {
    if (native) return;
    nextTick(update);
    if (!noresize) {
      addResizeListener(wrap.current, update);
      addResizeListener(resize.current, update);
      addEventListener('resize', update);
    }
  });

  useUnmount(() => {
    if (native) return;
    nextTick(update);
    if (!noresize) {
      removeResizeListener(wrap.current, update);
      removeResizeListener(resize.current, update);
      removeEventListener('resize', update);
    }
  });

  return (
    <div {...wrapperProps} className={`scrollbar ${className}`}>
      <div
        ref={wrap}
        style={wrapStyle}
        className={classNames(`${wrapClassName} scrollbar__wrap`, {
          'scrollbar__wrap--hidden-default': !native,
        })}
        onScroll={onScroll}
      >
        <div ref={resize} className={`scrollbar__view ${viewClassName}`} style={viewStyle}>
          {children}
        </div>
        {!native && (
          <>
            <Bar move={state.moveX} size={state.sizeWidth} parentWrap={wrap} />
            <Bar vertical move={state.moveY} size={state.sizeHeight} parentWrap={wrap} />
          </>
        )}
      </div>
    </div>
  );
});

export default Scrollbar;
