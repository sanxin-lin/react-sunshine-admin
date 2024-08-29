import { CSSProperties } from 'react';
import classNames from 'classnames';

import { Icon } from '@/components/Icon';
import { useDesign } from '@/hooks/web/useDesign';

import './BasicArrow.less';

interface IProps {
  className?: string;
  expand?: boolean;
  up?: boolean;
  down?: boolean;
  inset?: boolean;
  iconStyle?: CSSProperties;

  onClick?: (e) => void;
}

const BasicArrow = (props: IProps) => {
  const { className, expand, up, down, inset, iconStyle = {}, onClick } = props;

  const { prefixCls } = useDesign('basic-arrow');

  const wrapperClass = classNames(`${prefixCls} ${className}`, {
    [`${prefixCls}--active`]: expand,
    up,
    inset,
    down,
  });

  const _onClick = (e: any) => {
    onClick?.(e);
  };

  return (
    <span className={wrapperClass} onClick={_onClick}>
      <Icon icon="ion:chevron-forward" style={iconStyle} />
    </span>
  );
};

export default BasicArrow;
