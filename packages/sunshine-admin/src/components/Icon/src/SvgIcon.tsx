import { useCreation } from 'ahooks';
import classNames from 'classnames';

import { useDesign } from '@/hooks/web/useDesign';

import './SvgIcon.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {
  prefix?: string;
  name: string;
  size?: number | string;
  spin?: boolean;
}

const SvgIcon = (props: IProps) => {
  const { prefix = 'icon', name, size = 16, spin = false, className, ...wrapperProps } = props;

  const { prefixCls } = useDesign('svg-icon');
  const style = useCreation(() => {
    let s = `${size}`;
    s = `${s.replace('px', '')}px`;
    return {
      width: s,
      height: s,
    };
  }, [props]);
  const containerClassName = classNames(`${prefixCls} ${className}`, {
    'svg-icon-spin': spin,
  });
  const symbolId = `#${prefix}-${name}`;
  return (
    <svg {...wrapperProps} className={containerClassName} style={style} aria-hidden="true">
      <use xlinkHref={symbolId} />
    </svg>
  );
};

export default SvgIcon;
