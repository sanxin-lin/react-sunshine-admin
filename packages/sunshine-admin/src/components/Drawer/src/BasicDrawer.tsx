import { CSSProperties, useEffect, useState } from 'react';
import { useCreation, useMount } from 'ahooks';
import { Drawer } from 'antd';
import { has, isFunction, isNumber, isObject, merge, uniqueId } from 'lodash-es';

import { ScrollContainer } from '@/components/Container';
import { useEarliest } from '@/hooks/utils/useEarliest';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';

import DrawerFooter from './components/DrawerFooter';
import DrawerHeader from './components/DrawerHeader';
import { DrawerInstance, DrawerProps } from './types';

import './BasicDrawer.less';

interface IProps extends DrawerProps {}

const BasicDrawer = (props: IProps) => {
  const { onClose, onOpenChange, onOk, register, children, loadingText, isDetail, showDetailBack } =
    props;
  const uid = useEarliest(() => `BASIC_DRAWER_${uniqueId()}`);

  const [open, setOpen] = useState(false);

  const { t } = useLocale();
  const { prefixVar, prefixCls } = useDesign('basic-drawer');

  const [inputProps, setInputProps] = useState({} as Partial<DrawerProps>);

  const setDrawerProps = (v: Partial<DrawerProps>) => {
    setInputProps(v);
    if (has(v, 'open')) {
      setOpen(!!v.open);
    }
  };

  const drawerInstance: DrawerInstance = {
    setDrawerProps,
    emitOpen: undefined,
  };

  const allProps = useCreation(() => {
    return merge({ ...props }, { ...inputProps });
  }, [props, inputProps]);

  const wrapperProps = useCreation(() => {
    const opt: Partial<DrawerProps> = {
      placement: 'right',
      ...allProps,
      open,
    };
    opt.title = undefined;
    const { isDetail, width, wrapClassName, getContainer } = opt;
    if (isDetail) {
      if (!width) {
        opt.width = '100%';
      }
      const detailCls = `${prefixCls}__detail`;
      opt.rootClassName = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;

      if (!getContainer) {
        opt.getContainer = `.${prefixVar}-layout-content`;
      }
    }
    if (!has(opt, 'footerHeight')) {
      opt.footerHeight = '60px';
    }
    return opt;
  }, [allProps, open]);

  const footerHeight = useCreation(() => {
    const { showFooter, footerHeight } = wrapperProps;
    if (showFooter && footerHeight) {
      return isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace('px', '')}px`;
    }
    return `0px`;
  }, [wrapperProps]);

  const scrollContentStyle = useCreation((): CSSProperties => {
    return {
      position: 'relative',
      height: `calc(100% - ${footerHeight})`,
    };
  }, [footerHeight]);

  const loading = !!allProps.loading;

  useMount(() => {
    register(drawerInstance, uid.current);
  });

  useEffect(() => {
    if (!!allProps.open !== open) {
      setOpen(!!allProps.open);
    }
  }, [allProps.open]);

  useEffect(() => {
    onOpenChange?.(open);
    drawerInstance.emitOpen?.(open, uid.current);
  }, [open]);

  const handleOk = () => {
    onOk?.();
  };
  const handleClose = async () => {
    const { closeFunc } = allProps;
    if (closeFunc && isFunction(closeFunc)) {
      const res = await closeFunc();
      setOpen(!res);
      return;
    }
    onClose?.();
    setOpen(false);
  };

  const renderTitle = () => {
    const { title, titleToolbar } = allProps;
    if (isObject(title)) {
      return title;
    }
    return (
      <DrawerHeader
        title={title as string}
        isDetail={isDetail}
        showDetailBack={showDetailBack}
        onClose={handleClose}
        titleToolbar={titleToolbar}
      ></DrawerHeader>
    );
  };
  return (
    <Drawer
      {...(wrapperProps as any)}
      title={renderTitle()}
      className={`${prefixCls}`}
      onClose={handleClose}
    >
      <>
        <ScrollContainer
          style={scrollContentStyle}
          loading={loading}
          loadingTip={loadingText ?? t('common.loadingText')}
        >
          {children}
        </ScrollContainer>
        <DrawerFooter
          {...(wrapperProps as any)}
          onClose={handleClose}
          onOk={handleOk}
          height={footerHeight}
        />
      </>
    </Drawer>
  );
};

export default BasicDrawer;
