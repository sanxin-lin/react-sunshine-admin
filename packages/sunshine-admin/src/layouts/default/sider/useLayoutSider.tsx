import { RefObject } from 'react';
import { useMount } from 'ahooks';

import { TriggerEnum } from '@/enums/menuEnum';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useAppStoreActions } from '@/stores/modules/app';
import { nextTick } from '@/utils/dom';

import LayoutTrigger from '../trigger/Index';

/**
 * Handle related operations of menu events
 */
export function useSiderEvent() {
  const { setProjectConfig } = useAppStoreActions();
  const { miniWidthNumber } = useMenuSetting();

  const collapsedWidth = miniWidthNumber;

  function onBreakpointChange(broken: boolean) {
    setProjectConfig({
      menuSetting: {
        siderHidden: broken,
      },
    });
  }

  return { collapsedWidth, onBreakpointChange };
}

/**
 * Handle related operations of menu folding
 */
export function useTrigger(isMobile: boolean) {
  const { trigger, split } = useMenuSetting();

  const showTrigger = (() => {
    return trigger !== TriggerEnum.NONE && !isMobile && (trigger === TriggerEnum.FOOTER || split);
  })();

  const triggerAttr = (() => {
    if (showTrigger) {
      return {
        trigger: <LayoutTrigger />,
      };
    }
    return {
      trigger: null,
    };
  })();

  return { triggerAttr, showTrigger };
}

/**
 * Handle menu drag and drop related operations
 * @param siderRef
 * @param dragBarRef
 */
export function useDragLine(siderRef: RefObject<any>, dragBarRef: RefObject<any>, mix = false) {
  const { miniWidthNumber, collapsed, setMenuSetting } = useMenuSetting();

  useMount(() => {
    nextTick(() => {
      changeWrapWidth();
    });
  });

  function getEl(elRef: RefObject<any>): any {
    const el = elRef.current;

    return el;
  }

  function handleMouseMove(ele: HTMLElement, wrap: HTMLElement, clientX: number) {
    document.onmousemove = function (innerE) {
      let iT = (ele as any).left + (innerE.clientX - clientX);
      innerE = innerE || window.event;
      const maxT = 800;
      const minT = miniWidthNumber;
      iT < 0 && (iT = 0);
      iT > maxT && (iT = maxT);
      iT < minT && (iT = minT);
      ele.style.left = wrap.style.width = iT + 'px';
      return false;
    };
  }

  // Drag and drop in the menu area-release the mouse
  function removeMouseup(ele: any) {
    const wrap = getEl(siderRef);
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
      wrap.style.transition = 'width 0.2s';
      const width = parseInt(wrap.style.width);

      if (!mix) {
        const miniWidth = miniWidthNumber;
        if (!collapsed) {
          width > miniWidth + 20
            ? setMenuSetting({ menuWidth: width })
            : setMenuSetting({ collapsed: true });
        } else {
          width > miniWidth && setMenuSetting({ collapsed: false, menuWidth: width });
        }
      } else {
        setMenuSetting({ menuWidth: width });
      }

      ele.releaseCapture?.();
    };
  }

  function changeWrapWidth() {
    const ele = getEl(dragBarRef);
    if (!ele) return;
    const wrap = getEl(siderRef);
    if (!wrap) return;

    ele.onmousedown = (e: any) => {
      wrap.style.transition = 'unset';
      const clientX = e?.clientX;
      ele.left = ele.offsetLeft;
      handleMouseMove(ele, wrap, clientX);
      removeMouseup(ele);
      ele.setCapture?.();
      return false;
    };
  }

  return {};
}
