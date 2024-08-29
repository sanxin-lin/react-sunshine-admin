import { forwardRef, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';

import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDesign } from '@/hooks/web/useDesign';

import './DragBar.less';

import { BaseProps } from '#/compoments';
import { Nullable } from '#/global';

interface IProps extends BaseProps {
  mobile?: boolean;
}

const DragBar = forwardRef((props: IProps, ref) => {
  const { mobile, className, ...wrapperProps } = props;
  const wrap = useRef<Nullable<HTMLDivElement>>(null);
  const { miniWidthNumber, collapsed, canDrag } = useMenuSetting();
  const { prefixCls } = useDesign('darg-bar');
  const dragBarStyle = (() => {
    if (collapsed) {
      return { left: `${miniWidthNumber}px` };
    }
    return {};
  })();
  const wrapperClass = classNames(`${prefixCls} ${className}`, {
    [`${prefixCls}--hide`]: !canDrag || mobile,
  });

  useImperativeHandle(ref, () => ({
    wrap: wrap,
  }));

  return <div {...wrapperProps} className={wrapperClass} style={dragBarStyle} ref={wrap}></div>;
});

export default DragBar;
