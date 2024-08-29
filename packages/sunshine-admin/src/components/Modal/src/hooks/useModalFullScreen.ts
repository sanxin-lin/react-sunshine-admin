import { RefObject, useState } from 'react';

export interface UseFullScreenContext {
  wrapClassName: string | undefined;
  modalWrapperRef: RefObject<any>;
}

export function useFullScreen(context: UseFullScreenContext) {
  // const formerHeightRef = ref(0);
  const [fullScreen, setFullScreen] = useState(false);

  const wrapClassName = (() => {
    const clsName = context.wrapClassName || '';
    return fullScreen ? `fullscreen-modal ${clsName} ` : clsName;
  })();

  function handleFullScreen(e: Event) {
    e && e.stopPropagation();
    setFullScreen(!fullScreen);
  }
  return { wrapClassName, handleFullScreen, fullScreen, setFullScreen };
}
