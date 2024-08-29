import { useState } from 'react';
import { Button, Form, Input } from 'antd';

import { CountdownInput } from '@/components/CountDown';
import { useLocale } from '@/hooks/web/useLocale';

import LoginFormTitle from './LoginFormTitle';
import { useLoginStore } from './store';
import type { RestPasswordField } from './types';
import { LoginStateEnum } from './types';
import { useFormConfigs } from './useFormConfigs';

interface IProps {}

const FormItem = Form.Item<RestPasswordField>;

const initialValues = {
  account: '',
  mobile: '',
  sms: '',
};

const ForgetPasswordForm: React.FC<IProps> = () => {
  const { currentState, handleBackLogin } = useLoginStore();
  const show = currentState === LoginStateEnum.RESET_PASSWORD;

  const { form, formRules } = useFormConfigs();

  const [loading, setLoading] = useState(false);
  const { t } = useLocale();

  async function handleReset() {
    setLoading(false);
    if (!form) return;
    form.setFieldsValue({ ...initialValues });
  }

  if (!show) return null;

  return (
    <>
      <LoginFormTitle className="enter-x" />
      <Form form={form} className="p-4 enter-x" initialValues={initialValues}>
        <FormItem className="enter-x" name="account" rules={formRules.account}>
          <Input size="large" placeholder={t('sys.login.userName')} />
        </FormItem>
        <FormItem className="enter-x" name="mobile" rules={formRules.mobile}>
          <Input size="large" placeholder={t('sys.login.mobile')} />
        </FormItem>
        <FormItem className="enter-x" name="sms" rules={formRules.sms}>
          <CountdownInput size="large" placeholder={t('sys.login.smsCode')} />
        </FormItem>

        <FormItem className="enter-x">
          <Button type="primary" size="large" block={true} onClick={handleReset} loading={loading}>
            {t('common.resetText')}
          </Button>
          <Button size="large" block className="mt-4" onClick={handleBackLogin}>
            {t('sys.login.backSignIn')}
          </Button>
        </FormItem>
      </Form>
    </>
  );
};

export default ForgetPasswordForm;
