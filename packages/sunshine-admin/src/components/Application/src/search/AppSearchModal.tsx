import { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { SearchOutlined } from '@ant-design/icons';
import { useCreation } from 'ahooks';
import { Input, InputRef } from 'antd';
import classNames from 'classnames';

import { Icon } from '@/components/Icon';
import Portal from '@/components/Portal';
import { useDisplay } from '@/hooks/utils/useDisplay';
import { useRefs } from '@/hooks/utils/useRefs';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useAppStore } from '@/stores/modules/app';
import { nextTick } from '@/utils/dom';

import AppSearchFooter from './AppSearchFooter';
import { useSearch } from './useSearch';

import './AppSearchModal.less';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {
  onClose?: () => void;
  visible: boolean;
}

const AppSearchModal = (props: IProps) => {
  const { className, visible, onClose, ...wrapperProps } = props;

  const scrollWrap = useRef<HTMLUListElement>(null);
  const inputRef = useRef<InputRef>(null);

  const { t } = useLocale();
  const { prefixCls } = useDesign('app-search-modal');
  const isMoblie = useAppStore((state) => state.isMobile);
  const { refs, setRefs } = useRefs();
  const {
    handleSearch,
    searchResult,
    keyword,
    activeIndex,
    handleEnter,
    handleMouseenter,
    handleClose,
  } = useSearch(refs, scrollWrap, onClose);

  const isNotData = !keyword || searchResult.length === 0;

  const noDataDisplay = useDisplay(isNotData);
  const listDisplay = useDisplay(!isNotData);

  const wrapperClass = classNames(`${prefixCls} ${className}`, {
    [`${prefixCls}--mobile`]: isMoblie,
  });

  useEffect(() => {
    if (visible) {
      nextTick(() => {
        inputRef.current?.focus();
      });
    }
  }, [visible]);

  const body = useCreation(() => document.body, []);

  return (
    <Portal to={body}>
      <CSSTransition classNames="zoom-fade" in={visible} timeout={300} mountOnEnter unmountOnExit>
        <div
          {...wrapperProps}
          className={wrapperClass}
          onClick={() => {
            handleClose();
          }}
        >
          <div className={`${prefixCls}-content`}>
            <div className={`${prefixCls}-input__wrapper`}>
              <Input
                className={`${prefixCls}-input`}
                ref={inputRef}
                placeholder={t('common.searchText')}
                allowClear
                onChange={handleSearch as any}
                prefix={<SearchOutlined />}
              />
              <span className={`${prefixCls}-cancel`} onClick={handleClose}>
                {t('common.cancelText')}
              </span>
            </div>
            <span className={`${prefixCls}-not-data`} style={noDataDisplay}>
              {t('component.app.searchNotData')}
            </span>
            <ul className={`${prefixCls}-list`} ref={scrollWrap} style={listDisplay}>
              {searchResult.map((item, index) => (
                <li
                  ref={setRefs(index)}
                  key={item.path}
                  data-index={index}
                  onMouseEnter={handleMouseenter}
                  onClick={handleEnter}
                  className={classNames(`${prefixCls}-list__item`, {
                    [`${prefixCls}-list__item--active`]: activeIndex === index,
                  })}
                >
                  <div className={`${prefixCls}-list__item-icon`}>
                    <Icon icon={item.icon || 'mdi:form-select'} size={20} />
                  </div>
                  <div className={`${prefixCls}-list__item-text`}>{item.name}</div>
                  <div className={`${prefixCls}-list__item-enter`}>
                    <Icon icon="ant-design:enter-outlined" size={20} />
                  </div>
                </li>
              ))}
            </ul>
            <AppSearchFooter />
          </div>
        </div>
      </CSSTransition>
    </Portal>
  );
};

export default AppSearchModal;
