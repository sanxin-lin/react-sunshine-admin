import React from 'react';
import { useCreation } from 'ahooks';
import { Button, Result } from 'antd';

import netWorkSvg from '@/assets/svg/net-error.svg';
import notDataSvg from '@/assets/svg/no-data.svg';
import { ExceptionEnum } from '@/enums/exceptionEnum';
import { PageEnum } from '@/enums/pageEnum';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useGo, useRedo } from '@/hooks/web/usePage';
import { useRouterMatched } from '@/hooks/web/useRouterMatched';

import './Exception.less';

interface IProps {
  status?: number;
  title?: string;
  subTitle?: string;
  full?: boolean;
  className?: string;
}

interface MapValue {
  title: string;
  subTitle: string;
  btnText?: string;
  icon?: string;
  handler?: any;
  status?: string;
}

const Exception: React.FC<IProps> = (props) => {
  const {
    status: propsStatus = ExceptionEnum.PAGE_NOT_FOUND,
    title: propsTitle = '',
    subTitle: propsSubTitle = '',
    full = false,
    className = '',
  } = props;
  const go = useGo();
  const redo = useRedo();
  const { t } = useLocale();
  const { query } = useRouterMatched();
  const { prefixCls } = useDesign('app-exception-page');
  const backLoginText = t('sys.exception.backLogin');
  const backHomeText = t('sys.exception.backHome');
  const statusMapRef = useCreation<Record<number, MapValue>>(() => {
    return {
      [ExceptionEnum.PAGE_NOT_ACCESS]: {
        title: '403',
        status: `${ExceptionEnum.PAGE_NOT_ACCESS}`,
        subTitle: t('sys.exception.subTitle403'),
        btnText: full ? backLoginText : backHomeText,
        handler: () => (full ? go(PageEnum.BASE_LOGIN) : go()),
      },
      [ExceptionEnum.PAGE_NOT_FOUND]: {
        title: '404',
        status: `${ExceptionEnum.PAGE_NOT_FOUND}`,
        subTitle: t('sys.exception.subTitle404'),
        btnText: full ? backLoginText : backHomeText,
        handler: () => go(full ? PageEnum.BASE_LOGIN : undefined),
      },
      [ExceptionEnum.ERROR]: {
        title: '500',
        status: `${ExceptionEnum.ERROR}`,
        subTitle: t('sys.exception.subTitle500'),
        btnText: backHomeText,
        handler: () => go(),
      },
      [ExceptionEnum.PAGE_NOT_DATA]: {
        title: t('sys.exception.noDataTitle'),
        subTitle: '',
        btnText: t('common.redo'),
        handler: () => redo(),
        icon: notDataSvg,
      },
      [ExceptionEnum.NET_WORK_ERROR]: {
        title: t('sys.exception.networkErrorTitle'),
        subTitle: t('sys.exception.networkErrorSubTitle'),
        btnText: t('common.redo'),
        handler: () => redo(),
        icon: netWorkSvg,
      },
    };
  }, [full]);
  const errorInfo = statusMapRef[Number(query.status) || propsStatus] as MapValue;
  const { title, subTitle, btnText, icon, handler, status } = errorInfo || {};
  // antd 原来支持 status 可选： success | error | info | warning | 404 | 403 | 500
  // 上面 ExceptionEnum 覆盖了 404 | 403 | 500，并增加其他状态值
  // 增加下面判断，继续支持 success | error | info | warning
  const resultIcon =
    status && ExceptionEnum[status] === void 0 ? icon ? <img src={icon} /> : null : undefined;
  const extra = btnText && (
    <Button type="primary" onClick={handler}>
      {btnText}
    </Button>
  );
  return (
    <Result
      className={`${prefixCls} ${className}`}
      status={status as any}
      title={propsTitle || title}
      sub-title={propsSubTitle || subTitle}
      icon={resultIcon}
      extra={extra}
    ></Result>
  );
};

export default Exception;
