import { useRef, useState } from 'react';
import { useThrottleFn } from 'ahooks';
import { Empty, Input, Pagination, Popover } from 'antd';
import svgIcons from 'virtual:svg-icons-names';

import { ScrollContainer } from '@/components/Container';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { usePagination } from '@/hooks/web/usePagination';
import { copyText } from '@/utils/copyTextToClipboard';

import iconsData from '../data/icons.data';
import Icon from '../Icon';

import SvgIcon from './SvgIcon';

import './IconPicker.less';

import { Nullable } from '#/global';

interface IProps {
  value?: string;
  width?: string;
  pageSize?: number;
  copy?: boolean;
  mode?: 'svg' | 'iconify';
  allowClear?: boolean;
  readonly?: boolean;

  onChange?: (v: string) => void;
}

function getIcons() {
  const prefix = iconsData.prefix;
  return iconsData.icons.map((icon) => `${prefix}:${icon}`);
}

function getSvgIcons() {
  return svgIcons.map((icon: string) => icon.replace('icon-', ''));
}

const IconPicker = (props: IProps) => {
  const {
    value = '',
    width = '100%',
    pageSize = 140,
    copy = false,
    mode = 'iconify',
    allowClear = true,
    readonly = false,

    onChange,
  } = props;

  const isSvgMode = mode === 'svg';
  const icons = isSvgMode ? getSvgIcons() : getIcons();

  const trigger = useRef<Nullable<HTMLDivElement>>(null);
  const [currentList, setCurrentList] = useState(icons);

  const { t } = useLocale();
  const { prefixCls } = useDesign('icon-picker');

  const { paginationList, total, setCurrentPage } = usePagination(currentList, pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClick = (icon: string) => {
    onChange?.(icon);
    if (copy) {
      copyText(icon, t('component.icon.copy'));
    }
  };

  const handleSearchChange: any = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      setCurrentPage(1);
      setCurrentList(icons);
      return;
    }
    setCurrentList(icons.filter((item) => item.includes(value)));
  };

  const triggerPopover = () => {
    trigger.current?.click();
  };

  const { run: throttleHandleSearchChange } = useThrottleFn(handleSearchChange, {
    wait: 100,
  });

  const renderPopoverContent = () => {
    if (paginationList.length) {
      return (
        <div>
          <ScrollContainer className="border border-solid border-t-0">
            <ul className="flex flex-wrap px-2">
              {paginationList.map((icon) => (
                <li
                  key={icon}
                  className={`${value === icon ? 'border border-primary' : ''} p-2 w-1/8 cursor-pointer mr-1 mt-1 flex justify-center items-center border border-solid hover:border-primary`}
                  onClick={() => handleClick(icon)}
                  title={icon}
                >
                  {isSvgMode ? <SvgIcon name={icon} /> : <Icon icon={icon} />}
                </li>
              ))}
            </ul>
          </ScrollContainer>
          {total >= pageSize && (
            <div className="flex py-2 items-center justify-center">
              <Pagination
                showLessItems
                size="small"
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-5">
        <Empty />
      </div>
    );
  };

  return (
    <Input
      style={{ width }}
      placeholder={t('component.icon.placeholder')}
      className={prefixCls}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onClick={triggerPopover}
      allowClear={allowClear}
      readOnly={readonly}
      addonAfter={
        <Popover
          placement="bottomLeft"
          trigger="click"
          overlayClassName={`${prefixCls}-popover`}
          title={
            <div className="flex justify-between">
              <Input
                placeholder={t('component.icon.search')}
                onChange={throttleHandleSearchChange}
                allowClear
              />
            </div>
          }
          content={renderPopoverContent()}
        >
          <div ref={trigger}>
            {isSvgMode && value ? (
              <span className="cursor-pointer px-2 py-1 flex items-center">
                <SvgIcon name={value} />
              </span>
            ) : (
              <Icon icon={value || 'ion:apps-outline'} className="cursor-pointer px-2 py-1" />
            )}
          </div>
        </Popover>
      }
    />
  );
};

export default IconPicker;
