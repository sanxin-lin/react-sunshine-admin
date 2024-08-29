import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { ErrorTypeEnum } from '@/enums/exceptionEnum';
import projectSetting from '@/settings/projectSetting';
import { formatToDateTime } from '@/utils/date';

import type { Nullable } from '#/global';
import type { ErrorLogInfo } from '#/store';

export interface ErrorLogState {
  errorLogInfoList: Nullable<ErrorLogInfo[]>;
  errorLogListCount: number;

  getErrorLogInfoList(): ErrorLogInfo[];
  getErrorLogListCount(): number;

  addErrorLogInfo(info: ErrorLogInfo): void;
  setErrorLogListCount(count: number): void;
  addAjaxErrorInfo(error): void;
}

export const useErrorLogStore = create<ErrorLogState>((set, get) => ({
  errorLogInfoList: null,
  errorLogListCount: 0,

  getErrorLogInfoList(): ErrorLogInfo[] {
    return get().errorLogInfoList || [];
  },
  getErrorLogListCount(): number {
    return get().errorLogListCount;
  },

  addErrorLogInfo(info: ErrorLogInfo) {
    const item = {
      ...info,
      time: formatToDateTime(new Date()),
    };
    set({
      errorLogInfoList: [item, ...(get().errorLogInfoList || [])],
      errorLogListCount: get().errorLogListCount + 1,
    });
  },

  setErrorLogListCount(count: number): void {
    set({ errorLogListCount: count });
  },

  /**
   * Triggered after ajax request error
   * @param error
   * @returns
   */
  addAjaxErrorInfo(error) {
    const { useErrorHandle } = projectSetting;
    if (!useErrorHandle) {
      return;
    }
    const errInfo: Partial<ErrorLogInfo> = {
      message: error.message,
      type: ErrorTypeEnum.AJAX,
    };
    if (error.response) {
      const {
        config: { url = '', data: params = '', method = 'get', headers = {} } = {},
        data = {},
      } = error.response;
      errInfo.url = url;
      errInfo.name = 'Ajax Error!';
      errInfo.file = '-';
      errInfo.stack = JSON.stringify(data);
      errInfo.detail = JSON.stringify({ params, method, headers });
    }
    get().addErrorLogInfo(errInfo as ErrorLogInfo);
  },
}));

export const useErrorLogStoreActions = () => {
  return useErrorLogStore(
    useShallow((state) => ({
      addErrorLogInfo: state.addErrorLogInfo,
      setErrorLogListCount: state.setErrorLogListCount,
      addAjaxErrorInfo: state.addAjaxErrorInfo,
    })),
  );
};
