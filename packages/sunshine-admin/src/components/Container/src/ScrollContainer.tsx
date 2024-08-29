import { forwardRef, useImperativeHandle, useRef } from 'react';

import { Scrollbar, ScrollbarType } from '@/components/Scrollbar';
import { useScrollTo } from '@/hooks/utils/useScrollTo';
import { nextTick } from '@/utils/dom';
import { Loading, LoadingProps } from '@/components/Loading';

import './ScrollContainer.less';

import { BaseProps } from '#/compoments';
import { Nullable } from '#/global';

interface IProps extends BaseProps {
  scrollHeight?: number;

  loading?: LoadingProps['loading'];
  loadingTip?: LoadingProps['tip'];
}

const ScrollContainer = forwardRef((props: IProps, ref) => {
  const { scrollHeight, children, loading, loadingTip, ...wrapperProps } = props;
  const scrollbarRef = useRef<Nullable<ScrollbarType>>(null);

  const getScrollWrap = () => {
    const scrollbar = scrollbarRef.current;
    if (!scrollbar) return null;
    return scrollbar.wrap.current ? scrollbar.wrap.current : null;
  };

  /**
   * Scroll to the specified position
   */
  const scrollTo = (to: number, duration = 500) => {
    const wrap = getScrollWrap();
    nextTick(() => {
      if (!wrap) {
        return;
      }
      const { start } = useScrollTo({
        el: wrap,
        to,
        duration,
      });
      start();
    });
  };

  /**
   * Scroll to the bottom
   */
  const scrollBottom = () => {
    const wrap = getScrollWrap();
    nextTick(() => {
      if (!wrap) {
        return;
      }
      const scrollHeight = wrap.scrollHeight as number;
      const { start } = useScrollTo({
        el: wrap,
        to: scrollHeight,
      });
      start();
    });
  };

  useImperativeHandle(ref, () => ({
    scrollTo,
    scrollBottom,
  }));
  return (
    <Scrollbar
      ref={scrollbarRef}
      className="scroll-container"
      scrollHeight={scrollHeight}
      {...wrapperProps}
    >
      <>
        {children}
        <Loading loading={loading} absolute={true} tip={loadingTip} />
      </>
    </Scrollbar>
  );
});

export default ScrollContainer;
