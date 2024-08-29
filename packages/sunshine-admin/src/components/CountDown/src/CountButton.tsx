import { useEffect, useState } from 'react';
import { useCreation } from 'ahooks';
import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import { isFunction } from 'lodash-es';

import { useLocale } from '@/hooks/web/useLocale';

import { useCountdown } from './useCountdown';

interface IProps extends ButtonProps {
  value?: any;
  count?: number;
  beforeStart?: () => Promise<boolean>;
}

const CountButton: React.FC<IProps> = (props) => {
  const { value, count = 60, beforeStart, ...buttonProps } = props;
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { currentCount, isStart, start, reset } = useCountdown(count);

  const buttonText = useCreation(() => {
    return isStart
      ? t('component.countdown.sendText', { count: currentCount })
      : t('component.countdown.normalText');
  }, [currentCount, isStart]);

  useEffect(() => {
    if (value === undefined) {
      reset();
    }
  }, [value]);

  /**
   * @description: Judge whether there is an external function before execution, and decide whether to start after execution
   */
  const handleStart = async () => {
    if (isFunction(beforeStart)) {
      setLoading(true);
      try {
        const canStart = await beforeStart();
        canStart && start();
      } finally {
        setLoading(false);
      }
    } else {
      start();
    }
  };

  return (
    <Button {...buttonProps} disabled={isStart} loading={loading} onClick={handleStart}>
      {buttonText}
    </Button>
  );
};

export default CountButton;
