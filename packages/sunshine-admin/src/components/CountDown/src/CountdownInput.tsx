import type { ButtonProps, InputProps } from 'antd';
import { Input } from 'antd';

import { useDesign } from '@/hooks/web/useDesign';

import CountButton from './CountButton';

import './CountdownInput.less';

interface IProps extends Omit<InputProps, 'count'> {
  value?: string;
  size?: ButtonProps['size'];
  count?: number;
  sendCodeApi?: () => Promise<boolean>;
}

const CountdownInput: React.FC<IProps> = (props) => {
  const { value, size, count = 10, sendCodeApi, ...inputProps } = props;
  const { prefixCls } = useDesign('countdown-input');

  return (
    <Input
      {...inputProps}
      value={value}
      className={prefixCls}
      size={size}
      addonAfter={<CountButton size={size} count={count} beforeStart={sendCodeApi} value={value} />}
    />
  );
};

export default CountdownInput;
