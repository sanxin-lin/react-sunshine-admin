import { useCreation } from 'ahooks';
import type { FormRule } from 'antd';
import { Form } from 'antd';

import { useLocale } from '@/hooks/web/useLocale';
import { useLocaleStore } from '@/stores/modules/locale';

import { useLoginStore } from './store';
import { LoginStateEnum } from './types';

const createRule = (message: string): FormRule[] => {
  return [
    {
      required: true,
      message,
      validateTrigger: 'change',
    },
  ];
};

export const useFormConfigs = <T = any>() => {
  const { t } = useLocale();
  const { currentState } = useLoginStore();
  const [form] = Form.useForm<T>();
  const locale = useLocaleStore((state) => state.localInfo.locale);

  const accountFormRule = createRule(t('sys.login.accountPlaceholder'));
  const passwordFormRule = createRule(t('sys.login.passwordPlaceholder'));
  const smsFormRule = createRule(t('sys.login.smsPlaceholder'));
  const mobileFormRule = createRule(t('sys.login.mobilePlaceholder'));

  const validatePolicy = async (_: FormRule, value: boolean) => {
    return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve();
  };

  const validateConfirmPassword = async (_: FormRule, value: string) => {
    if (!value) {
      return Promise.reject(t('sys.login.passwordPlaceholder'));
    }
    const password = form.getFieldValue('password');
    if (value !== password) {
      return Promise.reject(t('sys.login.diffPwd'));
    }
    return Promise.resolve();
  };

  const formRules = useCreation((): Record<string, FormRule[]> => {
    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    };

    switch (currentState) {
      case LoginStateEnum.REGISTER:
        return {
          account: accountFormRule,
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword, validateTrigger: 'change', required: true },
          ],
          policy: [{ validator: validatePolicy, validateTrigger: 'change', required: true }],
          ...mobileRule,
        };

      case LoginStateEnum.RESET_PASSWORD:
        return {
          account: accountFormRule,
          ...mobileRule,
        };

      // mobile form rules
      case LoginStateEnum.MOBILE:
        return mobileRule;

      // login form rules
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        };
    }
  }, [currentState, locale]);

  return {
    formRules,
    form,
  };
};
