import { useEffect } from 'react';
import { useCreation, useThrottle } from 'ahooks';

import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useAppStore } from '@/stores/modules/app';
import { useLockStoreActions } from '@/stores/modules/lock';
import { useUserStore } from '@/stores/modules/user';

import { TimeoutHandle } from '#/global';

export const useLockPage = () => {
  const { lockTime } = useRootSetting();
  const { setLockInfo } = useLockStoreActions();
  const token = useUserStore((state) => state.getToken());
  const projectConfig = useAppStore((state) => state.getProjectConfig());

  let timeId: TimeoutHandle;

  const clear = () => {
    clearTimeout(timeId);
  };

  const lockPage = () => {
    setLockInfo({
      isLock: true,
      pwd: undefined,
    });
  };

  const resetCalcLockTimeout = () => {
    // not login
    if (!token) {
      clear();
      return;
    }

    const lockTime = projectConfig.lockTime;
    if (!lockTime || lockTime < 1) {
      clear();
      return;
    }
    clear();
    timeId = setTimeout(
      () => {
        lockPage();
      },
      lockTime * 60 * 1000,
    );
  };

  useEffect(() => {
    if (token) {
      resetCalcLockTimeout();
    } else {
      clear();
    }
    return () => {
      clear();
    };
  }, [token]);

  const keyupFn = useThrottle(resetCalcLockTimeout, {
    wait: 2000,
  });

  return useCreation(() => {
    if (lockTime) {
      return {
        onKeyup: keyupFn,
        onMousemove: keyupFn,
      };
    }
    clear();
    return {};
  }, [lockTime]);
};
