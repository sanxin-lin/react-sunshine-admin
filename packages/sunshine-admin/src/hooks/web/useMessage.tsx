import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import type { ModalFuncProps, NotificationArgsProps } from 'antd';
import { message as Message, Modal, notification } from 'antd';
import { isString } from 'lodash-es';

import { translatorWithout } from '@/locales';

export interface NotifyApi {
  info(config: NotificationArgsProps): void;
  success(config: NotificationArgsProps): void;
  error(config: NotificationArgsProps): void;
  warn(config: NotificationArgsProps): void;
  warning(config: NotificationArgsProps): void;
  open(args: NotificationArgsProps): void;
  close(key: String): void;
  config(options: Parameters<(typeof notification)['config']>[0]): void;
  destroy(): void;
}

export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export declare type IconType = 'success' | 'info' | 'error' | 'warning';
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled className="modal-icon-warning" />;
  } else if (iconType === 'success') {
    return <CheckCircleFilled className="modal-icon-success" />;
  } else if (iconType === 'info') {
    return <InfoCircleFilled className="modal-icon-info" />;
  } else {
    return <CloseCircleFilled className="modal-icon-error" />;
  }
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div dangerouslySetInnerHTML={{ __html: `<div>${content as string}</div>` }}></div>;
  } else {
    return content;
  }
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx) {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    okText: translatorWithout('common.okText'),
    cancelText: translatorWithout('common.cancelText'),
    ...options,
    content: renderContent(options),
  };
  return Modal.confirm(opt);
}

notification.config({
  placement: 'topRight',
  duration: 3,
});

export function useMessage() {
  const getBaseOptions = () => {
    return {
      okText: translatorWithout('common.okText'),
      centered: true,
    };
  };

  function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
    return {
      ...getBaseOptions(),
      ...options,
      content: renderContent(options),
      icon: getIcon(icon),
    };
  }

  function createSuccessModal(options: ModalOptionsPartial) {
    return Modal.success(createModalOptions(options, 'success'));
  }

  function createErrorModal(options: ModalOptionsPartial) {
    return Modal.error(createModalOptions(options, 'error'));
  }

  function createInfoModal(options: ModalOptionsPartial) {
    return Modal.info(createModalOptions(options, 'info'));
  }

  function createWarningModal(options: ModalOptionsPartial) {
    return Modal.warning(createModalOptions(options, 'warning'));
  }
  return {
    createMessage: Message,
    notification: notification as unknown as NotifyApi,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}
