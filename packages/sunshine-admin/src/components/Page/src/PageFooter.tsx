import { ReactNode } from 'react';

import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDesign } from '@/hooks/web/useDesign';

import './PageFooter.less';

interface IProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}

const PageFooter = (props: IProps) => {
  const { children, left, right } = props;
  const { prefixCls } = useDesign('page-footer');
  const { calcContentWidth } = useMenuSetting();

  return (
    <div className="prefixCls" style={{ width: calcContentWidth }}>
      <div className={`${prefixCls}__left`}>{left}</div>
      {children}
      <div className={`${prefixCls}__right`}>{right}</div>
    </div>
  );
};

export default PageFooter;
