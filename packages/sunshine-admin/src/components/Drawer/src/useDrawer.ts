import { useEffect, useRef } from 'react';
import { useUnmount } from 'ahooks';
import { isEqual, isFunction } from 'lodash-es';
import { create } from 'zustand';

import { nextTick } from '@/utils/dom';
import { isProdMode } from '@/utils/env';
import { error } from '@/utils/log';

import type {
  DrawerInstance,
  DrawerProps,
  ReturnMethods,
  UseDrawerInnerReturnType,
  UseDrawerReturnType,
} from './types';

import { Fn, Nullable } from '#/global';

interface DrawerStore {
  dataTransfer: Record<string, any>;
  openData: Record<string, boolean>;

  updateDataTransfer: (id: string, data: any) => void;
  updateOpenData: (id: string, open: boolean) => void;
}

const useDrawerStore = create<DrawerStore>((set, get) => ({
  dataTransfer: {},
  openData: {},

  updateDataTransfer(id, data) {
    set({ dataTransfer: { ...get().dataTransfer, [id]: data } });
  },
  updateOpenData(id, open) {
    set({ openData: { ...get().openData, [id]: open } });
  },
}));

export const useDrawer = (): UseDrawerReturnType => {
  const drawer = useRef<Nullable<DrawerInstance>>(null);
  const loaded = useRef<Nullable<boolean>>(false);
  const uid = useRef('0');
  const { dataTransfer, openData, updateDataTransfer, updateOpenData } = useDrawerStore();

  useUnmount(() => {
    if (isProdMode()) {
      drawer.current = null;
      loaded.current = false;
      updateDataTransfer(uid.current, null);
    }
  });

  const register = (drawerInstance: DrawerInstance, uuid: string) => {
    if (loaded.current && isProdMode() && drawerInstance === drawer.current) return;

    uid.current = uuid;
    drawer.current = drawerInstance;
    loaded.current = true;
    drawerInstance.emitOpen = (open: boolean, uid: string) => {
      updateOpenData(uid, open);
    };
  };

  const getInstance = () => {
    const instance = drawer.current;
    if (!instance) {
      error('useDrawer instance is undefined!');
    }
    return instance;
  };

  const methods: ReturnMethods = {
    setDrawerProps: (props: Partial<DrawerProps>): void => {
      getInstance()?.setDrawerProps(props);
    },

    getOpen: (): boolean => {
      return openData[uid.current];
    },

    openDrawer: <T = any>(open = true, data?: T, openOnSet = true): void => {
      getInstance()?.setDrawerProps({
        open,
      });
      if (!data) return;

      const id = uid.current;
      const equal = isEqual(dataTransfer[id], data);
      if (openOnSet || !equal) {
        updateDataTransfer(id, { ...data });
        return;
      }
    },
    closeDrawer: () => {
      getInstance()?.setDrawerProps({ open: false });
    },
  };

  return [register, methods];
};

export const useDrawerInner = (
  register: (drawerInstance: DrawerInstance, uuid: string) => void,
  callbackFn?: Fn,
): UseDrawerInnerReturnType => {
  const drawerInstanceRef = useRef<Nullable<DrawerInstance>>(null);
  const uidRef = useRef('0');
  const { dataTransfer, openData } = useDrawerStore();

  const getInstance = () => {
    const instance = drawerInstanceRef.current;
    if (!instance) {
      error('useDrawerInner instance is undefined!');
    }
    return instance;
  };

  useUnmount(() => {
    if (isProdMode()) {
      drawerInstanceRef.current = null;
    }
  });

  const _register = (drawerInstance: DrawerInstance, uuid: string) => {
    uidRef.current = uuid;
    drawerInstanceRef.current = drawerInstance;
    register(drawerInstance, uuid);
  };

  useEffect(() => {
    const data = dataTransfer[uidRef.current];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  }, [dataTransfer]);

  return [
    _register,
    {
      changeLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ loading });
      },

      changeOkLoading: (loading = true) => {
        getInstance()?.setDrawerProps({ confirmLoading: loading });
      },
      getOpen: (): boolean => {
        return openData[uidRef.current];
      },

      closeDrawer: () => {
        getInstance()?.setDrawerProps({ open: false });
      },

      setDrawerProps: (props: Partial<DrawerProps>) => {
        getInstance()?.setDrawerProps(props);
      },
    },
  ];
};

export default useDrawer;
