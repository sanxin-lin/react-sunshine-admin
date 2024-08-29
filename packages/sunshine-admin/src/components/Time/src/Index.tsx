import { useLocale } from '@/hooks/web/useLocale';
import { dateUtil, formatToDate, formatToDateTime } from '@/utils/date';
import { isNumber, isObject, isString } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useInterval } from 'ahooks';

interface IProps {
  value: number | Date | string;
  step?: number;
  mode?: 'date' | 'datetime' | 'relative';
}

const ONE_SECONDS = 1000;
const ONE_MINUTES = ONE_SECONDS * 60;
const ONE_HOUR = ONE_MINUTES * 60;
const ONE_DAY = ONE_HOUR * 24;

const Index = (props: IProps) => {
  const { value, step = 60, mode = 'relative' } = props;
  const [date, setDate] = useState('');
  const { t } = useLocale();

  const getTime = () => {
    let time = 0;
    if (isNumber(value)) {
      const timestamp = value.toString().length > 10 ? value : value * 1000;
      time = new Date(timestamp).getTime();
    } else if (isString(value)) {
      time = new Date(value).getTime();
    } else if (isObject(value)) {
      time = value.getTime();
    }
    return time;
  };

  const setTime = () => {
    const time = getTime();
    if (mode === 'relative') {
      setDate(getRelativeTime(time));
    } else {
      if (mode === 'datetime') {
        setDate(formatToDateTime(value));
      } else if (mode === 'date') {
        setDate(formatToDate(value));
      }
    }
  };

  const getRelativeTime = (timeStamp: number) => {
    const currentTime = new Date().getTime();

    // Determine whether the incoming timestamp is earlier than the current timestamp
    const isBefore = dateUtil(timeStamp).isBefore(currentTime);

    let diff = currentTime - timeStamp;
    if (!isBefore) {
      diff = -diff;
    }

    let resStr = '';
    let dirStr = isBefore ? t('component.time.before') : t('component.time.after');

    if (diff < ONE_SECONDS) {
      resStr = t('component.time.just');
      // Less than or equal to 59 seconds
    } else if (diff < ONE_MINUTES) {
      resStr = parseInt(String(diff / ONE_SECONDS)) + t('component.time.seconds') + dirStr;
      // More than 59 seconds, less than or equal to 59 minutes and 59 seconds
    } else if (diff >= ONE_MINUTES && diff < ONE_HOUR) {
      resStr = Math.floor(diff / ONE_MINUTES) + t('component.time.minutes') + dirStr;
      // More than 59 minutes and 59 seconds, less than or equal to 23 hours, 59 minutes and 59 seconds
    } else if (diff >= ONE_HOUR && diff < ONE_DAY) {
      resStr = Math.floor(diff / ONE_HOUR) + t('component.time.hours') + dirStr;
      // More than 23 hours, 59 minutes and 59 seconds, less than or equal to 29 days, 59 minutes and 59 seconds
    } else if (diff >= ONE_DAY && diff < 2623860000) {
      resStr = Math.floor(diff / ONE_DAY) + t('component.time.days') + dirStr;
      // More than 29 days, 59 minutes, 59 seconds, less than 364 days, 23 hours, 59 minutes, 59 seconds, and the incoming timestamp is earlier than the current
    } else if (diff >= 2623860000 && diff <= 31567860000 && isBefore) {
      resStr = dateUtil(timeStamp).format('MM-DD-HH-mm');
    } else {
      resStr = dateUtil(timeStamp).format('YYYY');
    }
    return resStr;
  };

  useInterval(setTime, step * ONE_SECONDS);

  useEffect(() => {
    setTime();
  }, [value]);

  return <span>{date}</span>;
};

export default Index;
