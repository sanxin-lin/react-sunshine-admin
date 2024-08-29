import { useCreation } from 'ahooks';
import { Select, SelectProps } from 'antd';

import { useDesign } from '@/hooks/web/useDesign';

import { HandlerEnum } from '../enum';
import { useSettingsHandler } from '../handler';

import './SelectItem.less';

import { LabelValueOptions } from '#/global';

interface IProps {
  event: HandlerEnum;
  disabled?: boolean;
  title: string;
  def?: string | number;
  initValue?: string | number;
  options?: LabelValueOptions;
}

const SelectItem = (props: IProps) => {
  const { event, disabled, title, def, initValue, options = [] } = props;
  const { prefixCls } = useDesign('setting-select-item');
  const { handleSettings } = useSettingsHandler();
  const selectProps = useCreation(() => {
    return def ? { value: def, defaultValue: initValue || def } : {};
  }, [def, initValue]);

  const handleChange: SelectProps['onChange'] = (val) => {
    event && handleSettings(event, val);
  };

  return (
    <div className={prefixCls}>
      <span> {title}</span>
      <Select
        {...selectProps}
        className={`${prefixCls}-select`}
        onChange={handleChange}
        disabled={disabled}
        size="small"
        options={options}
      />
    </div>
  );
};

export default SelectItem;
