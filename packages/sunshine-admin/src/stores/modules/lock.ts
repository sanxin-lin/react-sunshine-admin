import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { GetUserInfoModel } from '@/api/sys/model/userModel';
import { LOCK_INFO_KEY } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';

import { useUserStore } from './user';

import { Nullable } from '#/global';
import { LockInfo } from '#/store';

interface LockState {
  lockInfo: Nullable<LockInfo>;
}

interface LockAction {
  setLockInfo(info: LockInfo): void;
  resetLockInfo(): void;
  unLock(password?: string): Promise<boolean | GetUserInfoModel | null>;
}

type LockStore = LockState & LockAction;

export const useLockStore = create<LockStore>((set, get) => ({
  lockInfo: Persistent.getLocal(LOCK_INFO_KEY),

  setLockInfo(info) {
    const lockInfo = Object.assign({}, get().lockInfo, info);
    set({
      lockInfo,
    });
    Persistent.setLocal(LOCK_INFO_KEY, lockInfo, true);
  },
  resetLockInfo() {
    Persistent.removeLocal(LOCK_INFO_KEY, true);
    set({
      lockInfo: null,
    });
  },
  // Unlock
  async unLock(password) {
    const { resetLockInfo, lockInfo } = get();
    const { getUserInfo, login } = useUserStore.getState();
    if (lockInfo?.pwd === password) {
      resetLockInfo();
      return true;
    }
    const tryLogin = async () => {
      const { resetLockInfo } = get();
      try {
        const username = getUserInfo().username;
        const res = await login({
          username,
          password: password!,
          mode: 'none',
        });
        if (res) {
          resetLockInfo();
        }
        return res;
      } catch (error) {
        return false;
      }
    };
    return await tryLogin();
  },
}));

export const useLockStoreActions = () => {
  return useLockStore(
    useShallow((state) => ({
      setLockInfo: state.setLockInfo,
      resetLockInfo: state.resetLockInfo,
      unLock: state.unLock,
    })),
  );
};
