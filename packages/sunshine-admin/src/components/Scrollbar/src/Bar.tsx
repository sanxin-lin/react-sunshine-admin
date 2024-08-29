import { RefObject, useRef, useState } from 'react';
import { useUnmount } from 'ahooks';

import { off, on } from '@/utils/dom';

import { BAR_MAP, getThumbStyle } from './utils';

import { BaseProps } from '#/compoments';
import { Nullable, Recordable } from '#/global';

interface IProps extends BaseProps {
  vertical?: boolean;
  size?: string;
  move?: number;
  parentWrap: RefObject<Nullable<HTMLDivElement>>;
}

const Bar: React.FC<IProps> = (props) => {
  const { vertical, size, move, parentWrap, className = '', ...wrapperProps } = props;

  const wrap = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const bar = BAR_MAP[vertical ? 'vertical' : 'horizontal'];
  const [barStore, setBarStore] = useState<Recordable>({});
  const [cursorDown, setCursorDown] = useState(false);

  const mouseMoveDocumentHandler = (e: any) => {
    if (cursorDown === false) {
      return;
    }
    const prevPage = barStore.value[bar.axis];

    if (!prevPage) {
      return;
    }

    const offset = (wrap.current?.getBoundingClientRect()[bar.direction] - e[bar.client]) * -1;
    const thumbClickPosition = thumb.current?.[bar.offset] - prevPage;
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100) / wrap.current?.[bar.offset];
    if (parentWrap.current) {
      parentWrap.current[bar.scroll] =
        (thumbPositionPercentage * parentWrap.current?.[bar.scrollSize]) / 100;
    }
  };

  function mouseUpDocumentHandler() {
    setCursorDown(false);
    setBarStore((pre) => ({ ...pre, [bar.axis]: 0 }));
    off(document, 'mousemove', mouseMoveDocumentHandler);
    document.onselectstart = null;
  }

  const startDrag = (e: any) => {
    e.stopImmediatePropagation();
    setCursorDown(true);
    on(document, 'mousemove', mouseMoveDocumentHandler);
    on(document, 'mouseup', mouseUpDocumentHandler);
    document.onselectstart = () => false;
  };

  const clickThumbHandler = (e: any) => {
    // prevent click event of right button
    if (e.ctrlKey || e.button === 2) {
      return;
    }
    window.getSelection()?.removeAllRanges();
    startDrag(e);
    setBarStore((pre) => ({
      ...pre,
      [bar.axis]:
        e.currentTarget[bar.offset] -
        (e[bar.client] - e.currentTarget.getBoundingClientRect()[bar.direction]),
    }));
  };

  const clickTrackHandler = (e: any) => {
    const offset = Math.abs(e.target.getBoundingClientRect()[bar.direction] - e[bar.client]);
    const thumbHalf = thumb[bar.offset] / 2;
    const thumbPositionPercentage = ((offset - thumbHalf) * 100) / wrap.current?.[bar.offset];

    if (parentWrap.current) {
      parentWrap.current[bar.scroll] =
        (thumbPositionPercentage * parentWrap.current?.[bar.scrollSize]) / 100;
    }
  };

  useUnmount(() => {
    off(document, 'mouseup', mouseUpDocumentHandler);
  });

  const thumbStyle = getThumbStyle({
    size,
    move,
    bar,
  });

  return (
    <div
      {...wrapperProps}
      className={`scrollbar__bar is-${bar.key} ${className}`}
      onMouseDown={clickTrackHandler}
    >
      <div
        ref={thumb}
        className="scrollbar__thumb"
        onMouseDown={clickThumbHandler}
        style={thumbStyle}
      ></div>
    </div>
  );
};

export default Bar;
