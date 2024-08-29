import { CSSProperties, ReactNode, useEffect, useRef } from 'react';
import { PageHeader } from '@ant-design/pro-layout';
import { useCreation, useDebounceFn, useMount, useSize } from 'ahooks';
import classNames from 'classnames';
import { omit } from 'lodash-es';

import { ThemeEnum } from '@/enums/appEnum';
import { useContentHeight } from '@/hooks/web/useContentHeight';
import { useDesign } from '@/hooks/web/useDesign';
import { useAppStore } from '@/stores/modules/app';

import { PageWrapperContext } from './context';
import PageFooter from './PageFooter';

import './PageWrapper.less';

interface IProps {
  title?: string;
  dense?: boolean;
  ghost?: boolean;
  headerSticky?: boolean;
  headerStyle?: CSSProperties;
  content?: string;
  contentStyle?: CSSProperties;
  contentBackground?: boolean;
  contentFullHeight?: boolean;
  contentClass?: string;
  fixedHeight?: boolean;
  upwardSpace?: number | string;
  className?: string;
  headerContent?: ReactNode;
  leftFooter?: ReactNode;
  rightFooter?: ReactNode;
  children: ReactNode;
}

const PageWrapper = (props: IProps) => {
  const {
    title,
    dense,
    ghost,
    headerSticky,
    headerStyle = {},
    content,
    contentStyle = {},
    contentBackground,
    contentFullHeight = false,
    contentClass = '',
    fixedHeight,
    upwardSpace = 0,
    className = '',
    headerContent,
    leftFooter,
    rightFooter,
    children,
  } = props;

  const wrapperRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);

  const { height = 0 } = useSize(wrapperRef) ?? {};
  const { prefixCls } = useDesign('page-wrapper');
  const themeMode = useAppStore((state) => state.getThemeMode());

  const { redoHeight, setCompensation, contentHeight } = useContentHeight(
    contentFullHeight,
    wrapperRef,
    [headerRef, footerRef],
    [contentRef],
    upwardSpace,
  );
  useMount(() => {
    setCompensation({ useLayoutFooter: true, elements: [footerRef] });
  });

  const { run: debounceRedoHeight } = useDebounceFn(redoHeight, {
    wait: 50,
  });

  const wrapperClass = classNames(`${prefixCls} ${className}`, {
    [`${prefixCls}--dense`]: dense,
  });

  const wrapperStyle = useCreation(() => {
    return {
      ...(contentFullHeight && fixedHeight ? { height: '100%' } : {}),
    };
  }, [contentFullHeight, fixedHeight]);
  const _headerStyle = useCreation((): CSSProperties => {
    const backgroundColor = themeMode === ThemeEnum.DARK ? '#141414' : '#fff';
    if (!headerSticky) {
      return {
        backgroundColor,
      };
    }

    return {
      position: 'sticky',
      top: 0,
      zIndex: 99,
      backgroundColor,
      ...headerStyle,
    };
  }, [headerStyle, headerSticky, themeMode]);

  const showHeader = content || headerContent || title;
  const showFooter = leftFooter || rightFooter;

  const _contentStyle = useCreation(() => {
    if (!contentFullHeight) {
      return { ...contentStyle };
    }

    const height = `${contentHeight}px`;
    return {
      ...contentStyle,
      minHeight: height,
      ...(fixedHeight ? { height } : {}),
    };
  }, [contentFullHeight, contentStyle, fixedHeight, contentHeight]);

  const _contentClass = classNames(`${prefixCls}-content ${contentClass} overflow-hiddeen`, {
    [`${prefixCls}-content-bg`]: contentBackground,
  });

  useEffect(() => {
    redoHeight();
  }, [showFooter]);

  useEffect(() => {
    contentFullHeight && fixedHeight && debounceRedoHeight();
  }, [height]);

  const providerValue = useCreation(() => {
    return {
      fixedHeight: !!fixedHeight,
    };
  }, [fixedHeight]);

  return (
    <PageWrapperContext.Provider value={providerValue}>
      <div className={wrapperClass} style={wrapperStyle} ref={wrapperRef}>
        {showHeader && (
          <div ref={headerRef}>
            <PageHeader
              {...omit(props, 'className')}
              ghost={ghost}
              style={_headerStyle}
              title={title}
            >
              <>
                {content}
                {headerContent}
              </>
            </PageHeader>
          </div>
        )}

        <div className={_contentClass} style={_contentStyle} ref={contentRef}>
          {children}
        </div>

        {showFooter && (
          <div ref={footerRef}>
            <PageFooter left={leftFooter} right={rightFooter}></PageFooter>
          </div>
        )}
      </div>
    </PageWrapperContext.Provider>
  );
};

export default PageWrapper;
