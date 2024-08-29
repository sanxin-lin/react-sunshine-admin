import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useMount, useMutationObserver, useUnmount } from 'ahooks';
import { Spin } from 'antd';

import { ScrollContainer } from '@/components/Container';
import { useWindowSize } from '@/hooks/web/useWindowSize';
import { nextTick } from '@/utils/dom';

import { createModalProviderValue, ModalContext } from '../hooks/useModalContext';
import { ModalWrapperHandle, ModalWrapperProps } from '../types';

import { AnyFunction } from '#/global';

const ModalWrapper = forwardRef<ModalWrapperHandle, ModalWrapperProps>((props, ref) => {
  const {
    children,
    loading = false,
    useWrapper = true,
    modalFooterHeight = 74,
    modalHeaderHeight = 57,
    // minHeight = 200,
    height,
    footerOffset = 0,
    open,
    fullScreen,
    loadingTip,
    onHeightChange,
    onExtHeight,
  } = props;

  const wrapperRef = useRef(null);
  const spinRef = useRef(null);
  const [realHeight, setRealHeight] = useState(0);
  const [minRealHeight, setMinRealHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

  const stopElResizeFn: AnyFunction = () => {};

  // TODO 没啥卵用，注释掉
  // const spinStyle = useCreation(() => {
  //   return {
  //     minHeight: `${minHeight}px`,
  //     [fullScreen ? 'height' : 'maxHeight']: `${realHeight}px`,
  //   };
  // }, [minHeight, fullScreen, realHeight]);

  const setModalHeight = async () => {
    // TODO 没啥卵用，return 掉
    const flag = 1;
    if (flag) return;
    // 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
    // 加上这个,就必须在使用的时候传递父级的open
    if (!open) return;
    const wrapperRefDom = wrapperRef.current;
    if (!wrapperRefDom) return;

    const bodyDom = (wrapperRefDom as any).$el.parentElement;
    if (!bodyDom) return;
    bodyDom.style.padding = '0';
    await nextTick();

    try {
      const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement;
      if (!modalDom) return;

      const modalRect = getComputedStyle(modalDom as Element).top;
      const modalTop = Number.parseInt(modalRect);
      let maxHeight =
        window.innerHeight -
        modalTop * 2 +
        (footerOffset! || 0) -
        modalFooterHeight -
        modalHeaderHeight;

      // 距离顶部过进会出现滚动条
      if (modalTop < 40) {
        maxHeight -= 26;
      }
      await nextTick();
      const spinEl: any = spinRef.current;

      if (!spinEl) return;
      await nextTick();
      const _scrollHeight = spinEl.scrollHeight;
      setScrollHeight(_scrollHeight);
      let _realHeight = 0;
      if (fullScreen) {
        _realHeight = window.innerHeight - modalFooterHeight - modalHeaderHeight - 28;
      } else {
        _realHeight = height ? height : _scrollHeight > maxHeight ? maxHeight : _scrollHeight;
      }
      console.log(_realHeight);
      setRealHeight(_realHeight);
      onHeightChange?.(_realHeight);
    } catch (error) {
      console.log(error);
    }
  };

  useMutationObserver(
    () => {
      setModalHeight();
    },
    spinRef,
    {
      attributes: true,
      subtree: true,
    },
  );

  useEffect(() => {
    if (useWrapper) {
      setModalHeight();
    }
  }, [useWrapper]);

  useEffect(() => {
    setModalHeight();
    if (!fullScreen) {
      setRealHeight(minRealHeight);
    } else {
      setMinRealHeight(realHeight);
    }
  }, [fullScreen, realHeight, minRealHeight]);

  useWindowSize(() => {
    setModalHeight();
  });

  useMount(() => {
    onExtHeight?.(modalHeaderHeight + modalFooterHeight);
  });
  useUnmount(() => {
    stopElResizeFn?.();
  });

  const scrollTop = async () => {
    nextTick(() => {
      const wrapperRefDom = wrapperRef.current;
      if (!wrapperRefDom) return;
      (wrapperRefDom as any)?.scrollTo?.(0);
    });
  };

  useImperativeHandle(ref, () => ({
    scrollTop,
    setModalHeight,
  }));

  const contextValue = createModalProviderValue({
    redoModalHeight: setModalHeight,
  });
  return (
    <ModalContext.Provider value={contextValue}>
      <ScrollContainer ref={wrapperRef} scrollHeight={scrollHeight}>
        <div ref={spinRef} loading-tip={loadingTip}>
          <Spin spinning={loading}>{children}</Spin>
        </div>
      </ScrollContainer>
    </ModalContext.Provider>
  );
});

export default ModalWrapper;
