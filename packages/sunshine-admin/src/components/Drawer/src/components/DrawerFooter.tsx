import { CSSProperties, ReactNode } from 'react';
import { useCreation } from 'ahooks';
import { Button } from 'antd';

import { useDesign } from '@/hooks/web/useDesign';

import { DrawerFooterProps } from '../types';

import './DrawerFooter.less';
import { useLocale } from '@/hooks/web/useLocale';

interface IProps extends DrawerFooterProps {
  height?: string;
}

const Wrapper = (props: { className: string; style: CSSProperties; children: ReactNode }) => {
  const { className, style, children } = props;
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

const DrawerFooter = (props: IProps) => {
  const {
    height = '60px',
    onOk,
    onClose,
    showFooter,
    footer,
    insertFooter,
    appendFooter,
    centerFooter,
    cancelText,
    showOkBtn = true,
    showCancelBtn = true,
    okType = 'primary',
    okText,
    confirmLoading,
    okButtonProps = {},
    cancelButtonProps = {},
  } = props;
  const { prefixCls } = useDesign('basic-drawer-footer');
  const { t } = useLocale();
  const wrapperStyle = useCreation(() => {
    return {
      height: height,
      lineHeight: `calc(${height} - 1px)`,
    };
  }, [height]);

  const handleOk = () => {
    onOk?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!showFooter) return null;

  if (footer) {
    return (
      <Wrapper className={prefixCls} style={wrapperStyle}>
        {footer}
      </Wrapper>
    );
  }

  return (
    <Wrapper className={prefixCls} style={wrapperStyle}>
      <>
        {insertFooter}
        {showCancelBtn && (
          <Button {...cancelButtonProps} onClick={handleClose} className="mr-2">
            {cancelText ?? t('common.cancelText')}
          </Button>
        )}
        {centerFooter}
        {showOkBtn && (
          <Button
            {...okButtonProps}
            type={okType}
            loading={confirmLoading}
            onClick={handleOk}
            className="mr-2"
          >
            {okText ?? t('common.okText')}
          </Button>
        )}
        {appendFooter}
      </>
    </Wrapper>
  );
};

export default DrawerFooter;
