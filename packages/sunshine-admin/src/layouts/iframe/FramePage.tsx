import { CSSProperties, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useCreation, useMount, useUnmount } from 'ahooks';
import { Spin } from 'antd';

import { useDesign } from '@/hooks/web/useDesign';
import { useWindowSize } from '@/hooks/web/useWindowSize';
import { useLayoutHeight } from '@/layouts/default/content/useContentViewHeight';
import { nextTick } from '@/utils/dom';

import type { IframeInstance } from './types';

import './FramePage.less';

import { Nullable } from '#/global';

interface IProps {
  frameSrc?: string;
  onMessage?: (e: MessageEvent) => void;
  style?: CSSProperties;
}

const FramePage = forwardRef<IframeInstance, IProps>((props, ref) => {
  const { frameSrc = '', onMessage, style = {} } = props;

  const frameRef = useRef<Nullable<HTMLIFrameElement>>(null);

  const { headerHeight } = useLayoutHeight();

  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState(window.innerHeight);

  const { prefixCls } = useDesign('iframe-page');

  const calcHeight = () => {
    const iframe = frameRef.current;
    if (!iframe) return;
    setHeight(window.innerHeight - headerHeight);
    const clientHeight = document.documentElement.clientHeight - headerHeight;
    iframe.style.height = `${clientHeight}px`;
  };

  useWindowSize(calcHeight, {
    wait: 150,
    immediate: true,
  });

  const wrapperStyle = useCreation(() => {
    return {
      ...style,
      height: `${height}px`,
    };
  }, [height, style]);

  const hideLoading = () => {
    setLoading(false);
    calcHeight();
  };

  const messageHandler = (e: MessageEvent) => {
    onMessage?.(e);
  };

  const postMessage = (message: any, tragetOrigin: string, transfer?: Transferable[]) => {
    const iframe = frameRef.current;
    if (!iframe) return;
    iframe.contentWindow?.postMessage(message, tragetOrigin, transfer);
  };

  const reload = () => {
    setLoading(true);
    const iframe = frameRef.current;
    if (!iframe) return;
    iframe.contentWindow?.location.reload();
    nextTick(() => {
      setLoading(false);
    });
  };

  useMount(() => {
    window.addEventListener('message', messageHandler);
  });

  useUnmount(() => {
    window.removeEventListener('message', messageHandler);
  });

  useImperativeHandle(ref, () => ({
    reload,
    postMessage,
  }));

  return (
    <div className={prefixCls} style={wrapperStyle}>
      <Spin spinning={loading} size="large" style={wrapperStyle}>
        <iframe
          ref={frameRef}
          src={frameSrc}
          className={`${prefixCls}__main`}
          onLoad={hideLoading}
        ></iframe>
      </Spin>
    </div>
  );
});

export default FramePage;
