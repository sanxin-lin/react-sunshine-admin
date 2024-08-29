import { useEffect, useRef } from 'react';
import { useUnmount } from 'ahooks';
import { isEqual, isFunction } from 'lodash-es';
import { create } from 'zustand';

import { nextTick } from '@/utils/dom';
import { isProdMode } from '@/utils/env';
import { error } from '@/utils/log';

import type {
  ModalMethods,
  ModalProps,
  ReturnMethods,
  UseModalInnerReturnType,
  UseModalReturnType,
} from '../types';

import { Fn, Nullable } from '#/global';

interface ModalStore {
  dataTransfer: Record<string, any>;
  openData: Record<string, boolean>;

  updateDataTransfer: (id: string, data: any) => void;
  updateOpenData: (id: string, open: boolean) => void;
}

const useModalStore = create<ModalStore>((set, get) => ({
  dataTransfer: {},
  openData: {},

  updateDataTransfer(id, data) {
    set({ dataTransfer: { ...get().dataTransfer, [id]: data } });
  },
  updateOpenData(id, open) {
    set({ openData: { ...get().openData, [id]: open } });
  },
}));

/**
 * @description: Applicable to independent modal and call outside
 */

export const useModal = (): UseModalReturnType => {
  const modal = useRef<Nullable<ModalMethods>>(null);
  const loaded = useRef<Nullable<boolean>>(false);
  const uid = useRef('0');
  const { dataTransfer, openData, updateDataTransfer, updateOpenData } = useModalStore();

  useUnmount(() => {
    if (isProdMode()) {
      modal.current = null;
      loaded.current = false;
      updateDataTransfer(uid.current, null);
    }
  });

  const register = (modalMethod: ModalMethods, uuid: string) => {
    if (loaded.current && isProdMode() && modalMethod === modal.current) return;

    uid.current = uuid;
    modal.current = modalMethod;
    loaded.current = true;
    modalMethod.emitOpen = (open: boolean, uid: string) => {
      updateOpenData(uid, open);
    };
  };

  const getInstance = () => {
    const instance = modal.current;
    if (!instance) {
      error('useModal instance is undefined!');
    }
    return instance;
  };

  const methods: ReturnMethods = {
    setModalProps: (props: Partial<ModalProps>): void => {
      getInstance()?.setModalProps(props);
    },

    getOpen: (): boolean => {
      return openData[uid.current];
    },

    redoModalHeight: () => {
      getInstance()?.redoModalHeight?.();
    },

    openModal: <T = any>(open = true, data?: T, openOnSet = true): void => {
      getInstance()?.setModalProps({
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

    closeModal: () => {
      getInstance()?.setModalProps({ open: false });
    },
  };
  return [register, methods];
};

export const useModalInner = (
  register: (modalMethod: ModalMethods, uuid: string) => void,
  callbackFn?: Fn,
): UseModalInnerReturnType => {
  const modalInstanceRef = useRef<Nullable<ModalMethods>>(null);
  const uidRef = useRef('0');
  const { dataTransfer, openData } = useModalStore();

  const getInstance = () => {
    const instance = modalInstanceRef.current;
    if (!instance) {
      error('useModalInner instance is undefined!');
    }
    return instance;
  };

  useUnmount(() => {
    if (isProdMode()) {
      modalInstanceRef.current = null;
    }
  });

  const _register = (modalInstance: ModalMethods, uuid: string) => {
    uidRef.current = uuid;
    modalInstanceRef.current = modalInstance;
    register(modalInstance, uuid);
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
        getInstance()?.setModalProps({ loading });
      },
      getOpen: (): boolean => {
        return openData[uidRef.current];
      },

      changeOkLoading: (loading = true) => {
        getInstance()?.setModalProps({ confirmLoading: loading });
      },

      closeModal: () => {
        getInstance()?.setModalProps({ open: false });
      },

      setModalProps: (props: Partial<ModalProps>) => {
        getInstance()?.setModalProps(props);
      },

      redoModalHeight: () => {
        const callRedo = getInstance()?.redoModalHeight;
        callRedo && callRedo();
      },
    },
  ];
};
