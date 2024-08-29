import { Button } from 'antd';

import type { ModalProps } from '../types';

const ModalFooter = (props: ModalProps) => {
  const {
    insertFooter,
    centerFooter,
    appendFooter,
    showCancelBtn,
    cancelButtonProps = {},
    className,
    cancelText,
    okText,
    okType,
    confirmLoading,
    showOkBtn,
    okButtonProps = {},
    onOk,
    onCancel,
  } = props;
  return (
    <div className={className}>
      {insertFooter}
      {showCancelBtn && (
        <Button {...cancelButtonProps} onClick={onCancel as any}>
          {cancelText}
        </Button>
      )}
      {centerFooter}
      {showOkBtn && (
        <Button type={okType} onClick={onOk as any} loading={confirmLoading} {...okButtonProps}>
          {okText}
        </Button>
      )}
      {appendFooter}
    </div>
  );
};

export default ModalFooter;
