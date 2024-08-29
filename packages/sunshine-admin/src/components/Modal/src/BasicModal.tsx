import React, { useEffect, useRef, useState } from 'react';
import { useCreation, useMount } from 'ahooks';
import { has, isFunction, merge, omit, uniqueId } from 'lodash-es';

import { useEarliest } from '@/hooks/utils/useEarliest';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { nextTick } from '@/utils/dom';

import Modal from './components/Modal';
import ModalClose from './components/ModalClose';
import ModalFooter from './components/ModalFooter';
import ModalHeader from './components/ModalHeader';
import ModalWrapper from './components/ModalWrapper';
import { useFullScreen } from './hooks/useModalFullScreen';
import type { ModalMethods, ModalProps, ModalWrapperHandle } from './types';

import './BasicModal.less';

const BasicModal: React.FC<ModalProps> = (props) => {
  const {
    register,
    onOk,
    onCancel,
    onFullscreen,
    onHeightChange,
    canFullscreen,
    closeIcon,
    // title,
    children,
    wrapperFooterOffset,
    onOpenChange,
    onUpdateOpen,
  } = props;
  const [open, setOpen] = useState(false);
  const [propsState, setPropsState] = useState<Partial<ModalProps> | null>(null);
  const modalWrapperRef = useRef<ModalWrapperHandle>(null);
  const { prefixCls } = useDesign('basic-modal');
  const uid = useEarliest(() => uniqueId());

  const { t } = useLocale();

  const getDefaultProps = (): Partial<ModalProps> => {
    return {
      canFullscreen: true,
      wrapperFooterOffset: 0,
      useWrapper: true,
      showCancelBtn: true,
      showOkBtn: true,
      closable: true,
      mask: true,
      maskClosable: true,
      keyboard: true,
      okType: 'primary',
      cancelText: t('common.cancelText'),
      okText: t('common.okText'),
    };
  };

  // Custom title component: get title
  const mergeProps = useCreation((): any => {
    return {
      ...getDefaultProps(),
      ...props,
      ...propsState,
      open,
    };
  }, [props, propsState, open]);

  const {
    handleFullScreen: handleFullScreenInner,
    wrapClassName,
    fullScreen,
    setFullScreen,
  } = useFullScreen({
    modalWrapperRef,
    wrapClassName: mergeProps.wrapClassName,
  });

  const getProps = useCreation(() => {
    const opt = {
      ...(mergeProps as ModalProps),
      open,
      okButtonProps: undefined,
      cancelButtonProps: undefined,
      title: undefined,
    };
    return {
      ...opt,
      wrapClassName,
    };
  }, [mergeProps, open, wrapClassName]);

  const bindValue = useCreation(() => {
    const attr: any = {
      open,
      ...mergeProps,
    };
    if (attr['wrapClassName'] === wrapClassName) {
      attr['wrapClassName'] = `${attr['wrapClassName'] || ''} ` + prefixCls;
    } else {
      attr['wrapClassName'] = `${wrapClassName || ''}` + prefixCls;
    }
    if (fullScreen) {
      return omit(attr, ['height', 'title']);
    }
    return omit(attr, 'title');
  }, [mergeProps, wrapClassName, open, fullScreen]);

  // 取消事件
  const handleCancel = async (e: Event) => {
    e?.stopPropagation();
    // 过滤自定义关闭按钮的空白区域
    if ((e.target as HTMLElement)?.classList?.contains(prefixCls + '-close--custom')) return;
    if (props.closeFunc && isFunction(props.closeFunc)) {
      const isClose: boolean = await props.closeFunc();
      setOpen(!isClose);
      return;
    }
    setOpen(false);
    onCancel?.(e);
  };

  /**
   * @description: 设置modal参数
   */
  const setModalProps = (inputProps: Partial<ModalProps>): void => {
    // Keep the last setbindValue
    setPropsState({ ...merge(propsState || ({} as any), inputProps) });
    if (Reflect.has(inputProps, 'open')) {
      setOpen(!!inputProps.open);
    }
    if (Reflect.has(inputProps, 'defaultFullscreen')) {
      setFullScreen(!!inputProps.defaultFullscreen);
    }
  };

  const modalMethods: ModalMethods = {
    setModalProps,
    emitOpen: undefined,
    redoModalHeight: () => {
      nextTick(() => {
        if (modalWrapperRef.current) {
          modalWrapperRef.current.setModalHeight();
        }
      });
    },
  };

  useMount(() => {
    register(modalMethods, uid.current);
  });

  const handleOk = (e: Event) => {
    onOk?.(e);
  };

  function handleHeightChange(height: number) {
    onHeightChange?.(height);
  }

  function handleTitleDbClick(e) {
    if (!canFullscreen) return;
    e.stopPropagation();
    handleFullScreen(e);
  }

  // 事件传递
  function handleFullScreen(e: Event) {
    handleFullScreenInner(e);
    onFullscreen?.(e);
  }

  const wrapperHeight = useCreation(() => {
    if (fullScreen) return undefined;
    return getProps.height;
  }, [fullScreen, getProps]);

  useEffect(() => {
    setOpen(!!props.open);
    setFullScreen(!!props.defaultFullscreen);
  }, [props.open, props.defaultFullscreen]);

  useEffect(() => {
    onOpenChange?.(open);
    onUpdateOpen?.(open);
    if (modalMethods.emitOpen) {
      modalMethods.emitOpen(open, uid.current);
    }
    nextTick(() => {
      if (props.scrollTop && open && modalWrapperRef.current) {
        modalWrapperRef.current.scrollTop();
      }
    });
  }, [open, props.scrollTop]);

  const renderCloseIcon = () => {
    if (closeIcon) return closeIcon;
    return (
      <ModalClose
        canFullscreen={getProps.canFullscreen}
        fullScreen={fullScreen}
        onCancel={handleCancel}
        onFullScreen={handleFullScreen}
      />
    );
  };

  const renderTitle = () => {
    // if (title) return title;

    return (
      <ModalHeader
        helpMessage={getProps.helpMessage}
        title={mergeProps.title}
        onDbClick={handleTitleDbClick}
      />
    );
  };

  const renderFooter = () => {
    if (has(props, 'footer')) return props.footer;

    return <ModalFooter {...(bindValue as any)} onOk={handleOk} onCancel={handleCancel} />;
  };
  return (
    <Modal
      {...(bindValue as any)}
      closeIcon={renderCloseIcon()}
      title={renderTitle()}
      footer={renderFooter()}
    >
      <ModalWrapper
        {...(getProps.wrapperProps as any)}
        useWrapper={!!getProps.useWrapper}
        footerOffset={wrapperFooterOffset}
        fullScreen={fullScreen}
        ref={modalWrapperRef}
        loading={!!getProps.loading}
        loading-tip={getProps.loadingTip}
        minHeight={getProps.minHeight!}
        height={wrapperHeight!}
        open={open}
        // modalFooterHeight={footer !== undefined && !footer ? 0 : undefined}
        // onExtHeight={handleExtHeight}
        onHeightChange={handleHeightChange}
      >
        {children}
      </ModalWrapper>
    </Modal>
  );
};
export default BasicModal;
