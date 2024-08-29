import { InputNumber, InputNumberProps } from 'antd';

import { useDesign } from '@/hooks/web/useDesign';

import { HandlerEnum } from '../enum';
import { useSettingsHandler } from '../handler';

import './InputNumberItem.less';

interface IProps extends InputNumberProps {
  event: HandlerEnum;
  title: string;
}

const InputNumberItem = (props: IProps) => {
  const { event, title, ...wrapperProps } = props;
  const { handleSettings } = useSettingsHandler();

  const { prefixCls } = useDesign('setting-input-number-item');

  const handleChange = (v: any) => {
    event && handleSettings(event, v);
  };

  return (
    <div className={prefixCls}>
      <span> {title}</span>
      <InputNumber
        {...wrapperProps}
        size="small"
        className={`${prefixCls}-input-number`}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputNumberItem;
