import { ReactNode, useState } from 'react';
import { Skeleton } from 'antd';
import { isNil } from 'lodash-es';

import { useDesign } from '@/hooks/web/useDesign';
import { triggerWindowResize } from '@/utils/dom';

import CollapseHeader from './CollapseHeader';

import './CollapseContainer.less';

interface IProps {
  title?: ReactNode;
  action?: ReactNode;
  loading?: boolean;
  canExpand?: boolean;
  helpMessage?: string[] | string;
  triggerWindowResize?: boolean;
  lazyTime?: number;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const CollapseContainer = (props: IProps) => {
  const {
    loading,
    triggerWindowResize: triggerWindowResizeFlag,
    children,
    footer,
    canExpand = true,
    className = '',
    ...resetProps
  } = props;

  const { prefixCls } = useDesign('collapse-container');
  const [show, setShow] = useState(true);

  const handleExpand = (val?: boolean) => {
    setShow(isNil(val) ? !show : val);
    if (triggerWindowResizeFlag) {
      // 200 milliseconds here is because the expansion has animation,
      setTimeout(() => {
        triggerWindowResize();
      }, 200);
    }
  };

  return (
    <div className={`${prefixCls} ${className}`}>
      <CollapseHeader
        canExpand={canExpand}
        {...resetProps}
        prefixCls={prefixCls}
        onExpand={handleExpand}
        show={show}
      />

      <div className="p-2">
        {loading ? (
          <Skeleton active={loading} />
        ) : (
          <div className={`${prefixCls}__body`} style={show ? {} : { display: 'none' }}>
            {children}
          </div>
        )}
      </div>

      {footer && <div className={`${prefixCls}__footer`}>{footer}</div>}
    </div>
  );
};

export default CollapseContainer;
