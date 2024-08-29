import { useRef, useState } from 'react';
import { useUnmount } from 'ahooks';

export const useCountdown = (count: number) => {
  const [currentCount, setCurrentCount] = useState(count);
  const latestCount = useRef(count);
  const [isStart, setIsStart] = useState(false);

  let timerId: ReturnType<typeof setInterval> | null;

  const setCurrentCountFn = (v: number) => {
    latestCount.current = v;
    setCurrentCount(v);
  };

  const clear = () => {
    timerId && clearInterval(timerId);
    timerId = null;
  };

  const stop = () => {
    setIsStart(false);
    clear();
  };

  const reset = () => {
    setCurrentCountFn(count);
    stop();
  };

  const start = () => {
    if (isStart || timerId) {
      return;
    }
    setIsStart(true);
    timerId = setInterval(() => {
      if (latestCount.current === 1) {
        reset();
      } else {
        setCurrentCountFn(latestCount.current - 1);
      }
    }, 1000);
  };

  const restart = () => {
    reset();
    start();
  };

  useUnmount(() => {
    reset();
  });

  return {
    start,
    reset,
    restart,
    clear,
    stop,
    currentCount,
    isStart,
  };
};
