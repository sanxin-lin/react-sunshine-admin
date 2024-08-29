import { Modal as ModalComp } from 'antd';

import { useModalDragMove } from '../hooks/useModalDrag';
import type { ModalProps } from '../types';

import { BaseProps } from '#/compoments';

interface IProps extends ModalProps {
  draggable?: boolean;
}

const Modal = (props: IProps & BaseProps) => {
  const { children, ...wrapperProps } = props;

  useModalDragMove({
    open: !!props.open,
    destroyOnClose: props.destroyOnClose,
    draggable: !!props.draggable,
  });

  return <ModalComp {...(wrapperProps as any)}>{children}</ModalComp>;
};

export default Modal;
