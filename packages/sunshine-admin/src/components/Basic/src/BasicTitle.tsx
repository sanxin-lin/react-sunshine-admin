import { ReactNode } from 'react';
import classNames from 'classnames';

import { useDesign } from '@/hooks/web/useDesign';

import BasicHelp from './BasicHelp';

import './BasicTitle.less';

interface IProps {
  className?: string;
  children?: ReactNode;
  helpMessage?: string | string[];
  span?: boolean;
  normal?: boolean;
}

const BasicTitle = (props: IProps) => {
  const { className = '', children, helpMessage = '', span, normal } = props;
  const { prefixCls } = useDesign('basic-title');
  const wrapperClass = classNames(`${prefixCls} ${className}`, {
    [`${prefixCls}-show-span`]: span && children,
    [`${prefixCls}-normal`]: normal,
  });

  return (
    <span className={wrapperClass}>
      {children}
      {helpMessage && <BasicHelp className={`${prefixCls}-help`} text={helpMessage} />}
    </span>
  );
};

export default BasicTitle;
