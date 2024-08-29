// 此 hooks 废弃

import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { isEmpty, isNil, isString } from 'lodash-es';

import { SessionTimeoutProcessingEnum } from '@/enums/appEnum';
import { RequestEnum, ResultEnum } from '@/enums/httpEnum';
import { useMessage } from '@/hooks/web/useMessage';
import projectSetting from '@/settings/projectSetting';
import { useErrorLogStoreActions } from '@/stores/modules/errorLog';
import { useUserStoreActions } from '@/stores/modules/user';
import { getToken } from '@/utils/auth';
import {
  AxiosRetry,
  AxiosTransform,
  createAxios,
  formatRequestDate,
  joinTimestamp,
  setObjToUrlParams,
} from '@/utils/http';

import { useLocale } from './useLocale';

import type { ErrorMessageMode, RequestOptions, Result } from '#/axios';
import { Recordable } from '#/global';

export const useRequest = () => {
  const { createMessage, createErrorModal, createSuccessModal } = useMessage();
  const error = createMessage.error!;
  const stp = projectSetting.sessionTimeoutProcessing;
  const { t } = useLocale();
  const { setToken, setSessionTimeout, logout } = useUserStoreActions();
  const { addAjaxErrorInfo } = useErrorLogStoreActions();

  const checkStatus = (
    status: number,
    msg: string,
    errorMessageMode: ErrorMessageMode = 'message',
  ): void => {
    let errMessage = '';

    switch (status) {
      case 400:
        errMessage = `${msg}`;
        break;
      // 401: Not logged in
      // Jump to the login page if not logged in, and carry the path of the current page
      // Return to the current page after successful login. This step needs to be operated on the login page.
      case 401:
        setToken(undefined);
        errMessage = msg || t('sys.api.errMsg401');
        if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
          setSessionTimeout(true);
        } else {
          // 被动登出，带redirect地址
          logout(false);
        }
        break;
      case 403:
        errMessage = t('sys.api.errMsg403');
        break;
      // 404请求不存在
      case 404:
        errMessage = t('sys.api.errMsg404');
        break;
      case 405:
        errMessage = t('sys.api.errMsg405');
        break;
      case 408:
        errMessage = t('sys.api.errMsg408');
        break;
      case 500:
        errMessage = t('sys.api.errMsg500');
        break;
      case 501:
        errMessage = t('sys.api.errMsg501');
        break;
      case 502:
        errMessage = t('sys.api.errMsg502');
        break;
      case 503:
        errMessage = t('sys.api.errMsg503');
        break;
      case 504:
        errMessage = t('sys.api.errMsg504');
        break;
      case 505:
        errMessage = t('sys.api.errMsg505');
        break;
      default:
    }

    if (errMessage) {
      if (errorMessageMode === 'modal') {
        createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
      } else if (errorMessageMode === 'message') {
        error({ content: errMessage, key: `global_error_message_status_${status}` });
      }
    }
  };

  /**
   * @description: 数据处理，方便区分多种处理方式
   */
  const transform: AxiosTransform = {
    /**
     * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
     */
    transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
      const { isTransformResponse, isReturnNativeResponse } = options;
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (isReturnNativeResponse) {
        return res;
      }
      // 不进行任何处理，直接返回
      // 用于页面代码可能需要直接获取code，data，message这些信息时开启
      if (!isTransformResponse) {
        return res.data;
      }
      // 错误的时候返回

      const { data } = res;
      if (!data) {
        // return '[HTTP] Request has no return value';
        throw new Error(t('sys.api.apiRequestFailed'));
      }
      //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
      const { code, result, message } = data;

      // 这里逻辑可以根据项目进行修改
      const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
      if (hasSuccess) {
        let successMsg = message;

        if (isNil(successMsg) || isEmpty(successMsg)) {
          successMsg = t(`sys.api.operationSuccess`);
        }

        if (options.successMessageMode === 'modal') {
          createSuccessModal({ title: t('sys.api.successTip'), content: successMsg });
        } else if (options.successMessageMode === 'message') {
          createMessage.success(successMsg);
        }
        return result;
      }

      // 在此处根据自己项目的实际情况对不同的code执行不同的操作
      // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
      let timeoutMsg = '';
      switch (code) {
        case ResultEnum.TIMEOUT:
          timeoutMsg = t('sys.api.timeoutMessage');
          // 被动登出，带redirect地址
          logout(false);
          break;
        default:
          if (message) {
            timeoutMsg = message;
          }
      }

      // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
      // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
      if (options.errorMessageMode === 'modal') {
        createErrorModal({ title: t('sys.api.errorTip'), content: timeoutMsg });
      } else if (options.errorMessageMode === 'message') {
        createMessage.error(timeoutMsg);
      }

      throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'));
    },

    // 请求之前处理config
    beforeRequestHook: (config, options) => {
      const {
        apiUrl,
        joinPrefix,
        joinParamsToUrl,
        formatDate,
        joinTime = true,
        urlPrefix,
      } = options;

      if (joinPrefix) {
        config.url = `${urlPrefix}${config.url}`;
      }

      if (apiUrl && isString(apiUrl)) {
        config.url = `${apiUrl}${config.url}`;
      }
      const params = config.params || {};
      const data = config.data || false;
      formatDate && data && !isString(data) && formatRequestDate(data);
      if (config.method?.toUpperCase() === RequestEnum.GET) {
        if (!isString(params)) {
          // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
          config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
        } else {
          // 兼容restful风格
          config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
          config.params = undefined;
        }
      } else {
        if (!isString(params)) {
          formatDate && formatRequestDate(params);
          if (
            Reflect.has(config, 'data') &&
            config.data &&
            (Object.keys(config.data).length > 0 || config.data instanceof FormData)
          ) {
            config.data = data;
            config.params = params;
          } else {
            // 非GET请求如果没有提供data，则将params视为data
            config.data = params;
            config.params = undefined;
          }
          if (joinParamsToUrl) {
            config.url = setObjToUrlParams(
              config.url as string,
              Object.assign({}, config.params, config.data),
            );
          }
        } else {
          // 兼容restful风格
          config.url = config.url + params;
          config.params = undefined;
        }
      }
      return config;
    },

    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config, options) => {
      // 请求之前处理config
      const token = getToken();
      if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
        // jwt token
        (config as Recordable).headers.Authorization = options.authenticationScheme
          ? `${options.authenticationScheme} ${token}`
          : token;
      }
      return config;
    },

    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: (res: AxiosResponse<any>) => {
      return res;
    },

    /**
     * @description: 响应错误处理
     */
    responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
      addAjaxErrorInfo(error);
      const { response, code, message, config } = error || {};
      const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
      const msg: string = response?.data?.error?.message ?? '';
      const err: string = error?.toString?.() ?? '';
      let errMessage = '';

      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      try {
        if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
          errMessage = t('sys.api.apiTimeoutMessage');
        }
        if (err?.includes('Network Error')) {
          errMessage = t('sys.api.networkExceptionMsg');
        }

        if (errMessage) {
          if (errorMessageMode === 'modal') {
            createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
          } else if (errorMessageMode === 'message') {
            createMessage.error(errMessage);
          }
          return Promise.reject(error);
        }
      } catch (error) {
        throw new Error(error as unknown as string);
      }

      checkStatus(error?.response?.status, msg, errorMessageMode);

      // 添加自动重试机制 保险起见 只针对GET请求
      const retryRequest = new AxiosRetry();
      const { isOpenRetry } = config.requestOptions.retryRequest;
      config.method?.toUpperCase() === RequestEnum.GET &&
        isOpenRetry &&
        error?.response?.status !== 401 &&
        // @ts-ignore
        retryRequest.retry(axiosInstance, error);
      return Promise.reject(error);
    },
  };

  return createAxios({ transform: transform });
};
