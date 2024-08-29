import { useMount, useReactive, useUnmount } from 'ahooks';

import { dateUtil } from '@/utils/date';

import { IntervalHandle } from '#/global';

export function useNow(immediate = true) {
  let timer: IntervalHandle;

  const date = useReactive({
    year: 0,
    month: 0,
    week: '',
    day: 0,
    hour: '',
    minute: '',
    second: 0,
    meridiem: '',
  });

  const update = () => {
    const now = dateUtil();

    const h = now.format('HH');
    const m = now.format('mm');
    const s = now.get('s');

    date.year = now.get('y');
    date.month = now.get('M') + 1;
    date.week = '星期' + ['日', '一', '二', '三', '四', '五', '六'][now.day()];
    date.day = now.get('date');
    date.hour = h;
    date.minute = m;
    date.second = s;

    date.meridiem = now.format('A');
  };

  function start() {
    update();
    clearInterval(timer);
    timer = setInterval(() => update(), 1000);
  }

  function stop() {
    clearInterval(timer);
  }

  useMount(() => {
    immediate && start();
  });

  useUnmount(() => {
    stop();
  });

  return {
    date,
    start,
    stop,
  };
}
