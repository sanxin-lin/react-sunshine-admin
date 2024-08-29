import { ReactNode } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { BasicTitle } from '@/components/Basic';
import { useDesign } from '@/hooks/web/useDesign';

import './DrawerHeader.less';

interface IProps {
  isDetail?: boolean;
  showDetailBack?: boolean;
  title: string;
  onClose?: () => void;
  titleToolbar?: ReactNode;
}

const DrawerHeader = (props: IProps) => {
  const { isDetail, showDetailBack = true, title, onClose, titleToolbar } = props;
  const { prefixCls } = useDesign('basic-drawer-header');

  function handleClose() {
    onClose?.();
  }

  if (isDetail) {
    return (
      <div className={`${prefixCls} ${prefixCls}--detail`}>
        <span className={`${prefixCls}__twrap`}>
          {showDetailBack && (
            <span onClick={handleClose}>
              <ArrowLeftOutlined className={`${prefixCls}__back`} />
            </span>
          )}
          {title && <span>{title}</span>}
        </span>

        <span className={`${prefixCls}__toolbar`}>{titleToolbar}</span>
      </div>
    );
  }

  return <BasicTitle className={prefixCls}>{title}</BasicTitle>;
};

export default DrawerHeader;
