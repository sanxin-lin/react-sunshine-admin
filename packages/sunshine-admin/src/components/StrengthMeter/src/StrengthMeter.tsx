import { ChangeEvent, useEffect, useState } from 'react';
import { zxcvbn } from '@zxcvbn-ts/core';
import { useCreation } from 'ahooks';
import { Input } from 'antd';
import type { PasswordProps } from 'antd/es/input';

import { useDesign } from '@/hooks/web/useDesign';

import './StrengthMeter.less';

interface IProps extends Omit<PasswordProps, 'onChange'> {
  value?: string;
  showInput?: boolean;
  disabled?: boolean;
  onChange?: (v: string) => void;
  onScoreChange?: (v: number) => void;
}

const StrengthMeter: React.FC<IProps> = (props) => {
  const {
    value = '',
    showInput = true,
    disabled,
    onScoreChange,
    onChange,
    ...passwordProps
  } = props;
  const { prefixCls } = useDesign('strength-meter');
  const [innerValue, setInnerValue] = useState(value);
  const strength = useCreation(() => {
    if (disabled) return -1;
    const score = innerValue ? zxcvbn(innerValue).score : -1;
    onScoreChange?.(score);
    return score;
  }, [disabled, innerValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
    setInnerValue(e.target.value);
  };

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  useEffect(() => {
    onChange?.(innerValue);
  }, [innerValue]);

  return (
    <div className={`${prefixCls} relative`}>
      {showInput && (
        <Input.Password
          {...passwordProps}
          allowClear
          value={innerValue}
          onChange={handleChange}
          disabled={disabled}
        ></Input.Password>
      )}
      <div className={`${prefixCls}-bar`}>
        <div className={`${prefixCls}-bar--fill`} data-score={strength}></div>
      </div>
    </div>
  );
};

export default StrengthMeter;
