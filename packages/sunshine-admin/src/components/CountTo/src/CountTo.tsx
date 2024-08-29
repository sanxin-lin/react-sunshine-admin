import { useEffect, useState } from 'react';
import { isNumber } from 'lodash-es';

import { TransitionPresets, useTransition } from '@/hooks/utils/useTransition';

interface IProps {
  startVal?: number;
  endVal?: number;
  duration?: number;
  //   autoplay?: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimal?: string;
  color?: string;
  useEasing?: true;
  transition?: string;

  onStarted?: () => void;
  onFinished?: () => void;

  className?: string;
}

const CountTo = (props: IProps) => {
  const {
    startVal = 0,
    endVal = 2021,
    duration = 1500,
    // autoplay = true,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    decimal = '.',
    color,
    useEasing = true,
    transition = 'linear',
    onStarted,
    onFinished,

    className = '',
  } = props;

  function formatNumber(num: number | string) {
    if (!num && num !== 0) {
      return '';
    }
    num = Number(num).toFixed(decimals);
    num += '';

    const x = num.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? decimal + x[1] : '';

    const rgx = /(\d+)(\d{3})/;
    if (separator && !isNumber(separator)) {
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + separator + '$2');
      }
    }
    return prefix + x1 + x2 + suffix;
  }

  const [source, setSource] = useState(startVal);

  useEffect(() => {
    setSource(endVal);
  }, [endVal]);

  const outputValue = useTransition(source, {
    duration,
    onFinished,
    onStarted,
    transition: useEasing ? TransitionPresets[transition] : undefined,
  });

  const value = formatNumber(outputValue);

  return (
    <span className={className} style={{ color }}>
      {value}
    </span>
  );
};

export default CountTo;
