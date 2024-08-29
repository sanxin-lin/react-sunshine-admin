import { SessionTimeoutProcessingEnum } from '@/enums/appEnum';
import { useMessage } from '@/hooks/web/useMessage';
import { translatorWithout } from '@/locales';
import projectSetting from '@/settings/projectSetting';
import { useUserStore } from '@/stores/modules/user';

import type { ErrorMessageMode } from '#/axios';

const { createMessage, createErrorModal } = useMessage();
const error = createMessage.error!;
const stp = projectSetting.sessionTimeoutProcessing;

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const { setToken, setSessionTimeout, logout } = useUserStore.getState();
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      console.log(888);
      setToken(undefined);
      errMessage = msg || translatorWithout('sys.api.errMsg401');
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        setSessionTimeout(true);
      } else {
        // 被动登出，带redirect地址
        logout(false);
      }
      break;
    case 403:
      errMessage = translatorWithout('sys.api.errMsg403');
      break;
    // 404请求不存在
    case 404:
      errMessage = translatorWithout('sys.api.errMsg404');
      break;
    case 405:
      errMessage = translatorWithout('sys.api.errMsg405');
      break;
    case 408:
      errMessage = translatorWithout('sys.api.errMsg408');
      break;
    case 500:
      errMessage = translatorWithout('sys.api.errMsg500');
      break;
    case 501:
      errMessage = translatorWithout('sys.api.errMsg501');
      break;
    case 502:
      errMessage = translatorWithout('sys.api.errMsg502');
      break;
    case 503:
      errMessage = translatorWithout('sys.api.errMsg503');
      break;
    case 504:
      errMessage = translatorWithout('sys.api.errMsg504');
      break;
    case 505:
      errMessage = translatorWithout('sys.api.errMsg505');
      break;
    default:
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      createErrorModal({ title: translatorWithout('sys.api.errorTip'), content: errMessage });
    } else if (errorMessageMode === 'message') {
      error({ content: errMessage, key: `global_error_message_status_${status}` });
    }
  }
}
