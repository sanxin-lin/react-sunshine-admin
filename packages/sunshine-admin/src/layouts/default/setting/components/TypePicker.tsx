import { Tooltip } from 'antd';
import classNames from 'classnames';

import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useDesign } from '@/hooks/web/useDesign';

import { HandlerEnum } from '../enum';
import { useSettingsHandler } from '../handler';

import './TypePicker.less';

interface IProps {
  menuTypeList?: { title: string; mode: MenuModeEnum; type: MenuTypeEnum }[];
  def?: string;
}

const TypePicker = (props: IProps) => {
  const { def = '', menuTypeList = [] } = props;
  const { prefixCls } = useDesign('setting-menu-type-picker');

  const { handleSettings } = useSettingsHandler();

  const { isHorizontal } = useMenuSetting();

  const onClick = (item: { title: string; mode: MenuModeEnum; type: MenuTypeEnum }) => {
    handleSettings(HandlerEnum.CHANGE_LAYOUT, {
      mode: item.mode,
      type: item.type,
      split: isHorizontal ? false : undefined,
    });
  };

  return (
    <div className={prefixCls}>
      {menuTypeList.map((item) => (
        <Tooltip key={item.title} title={item.title} placement="bottom">
          <div
            onClick={() => onClick(item)}
            className={classNames(`${prefixCls}__item ${prefixCls}__item--${item.type}`, {
              [`${prefixCls}__item--active`]: def === item.type,
            })}
          >
            <div className="mix-sidebar"></div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export default TypePicker;
