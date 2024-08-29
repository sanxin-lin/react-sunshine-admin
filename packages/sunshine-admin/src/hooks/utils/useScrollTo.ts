export interface UseScrollToOptions {
  el: any;
  to: number;
  duration?: number;
  callback?: () => any;
}

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

function move(el: HTMLElement, amount: number) {
  el.scrollTop = amount;
}

const position = (el: HTMLElement) => {
  return el.scrollTop;
};
export function useScrollTo({ el, to, duration = 500, callback }: UseScrollToOptions) {
  let isActiveRef = false;
  const start = position(el);
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = function () {
    if (!isActiveRef) {
      return;
    }
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    move(el, val);
    if (currentTime < duration && isActiveRef) {
      requestAnimationFrame(animateScroll);
    } else {
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };
  const run = () => {
    isActiveRef = true;
    animateScroll();
  };

  const stop = () => {
    isActiveRef = false;
  };

  return { start: run, stop };
}
