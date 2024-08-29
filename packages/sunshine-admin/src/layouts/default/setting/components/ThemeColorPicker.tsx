import { CheckOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import { useDesign } from '@/hooks/web/useDesign';

import { HandlerEnum } from '../enum';
import { useSettingsHandler } from '../handler';

import './ThemeColorPicker.less';

interface IProps {
  colorList?: string[];
  event: HandlerEnum;
  def?: string;
}

const ThemeColorPicker = (props: IProps) => {
  const { colorList = [], event, def } = props;
  const { handleSettings } = useSettingsHandler();
  const { prefixCls } = useDesign('setting-theme-picker');

  function handleClick(color: string) {
    event && handleSettings(event, color);
  }

  return (
    <div className={prefixCls}>
      {colorList.map((color) => {
        return (
          <span
            key={color}
            onClick={() => handleClick(color)}
            className={classNames(`${prefixCls}__item`, {
              [`${prefixCls}__item--active`]: def === color,
            })}
            style={{ background: color }}
          >
            <CheckOutlined />
          </span>
        );
      })}
    </div>
  );
};

export default ThemeColorPicker;
