import { useState } from 'react';
import { Button, Form, Input } from 'antd';

import { CountdownInput } from '@/components/CountDown';
import { useLocale } from '@/hooks/web/useLocale';

import LoginFormTitle from './LoginFormTitle';
import { useLoginStore } from './store';
import { LoginStateEnum, MobileField } from './types';
import { useFormConfigs } from './useFormConfigs';

interface IProps {}

const FormItem = Form.Item<MobileField>;

export const MobileForm: React.FC<IProps> = () => {
  const { t } = useLocale();
  const { handleBackLogin, currentState } = useLoginStore();
  const show = currentState === LoginStateEnum.MOBILE;
  const [loading, setLoading] = useState(false);
  const { form, formRules } = useFormConfigs();

  const handleLogin = (data) => {
    setLoading(true);
    console.log(data);
    setLoading(false);
  };

  if (!show) return null;

  return (
    <>
      <LoginFormTitle />
      <Form className="p-4 enter-x" form={form} onFinish={handleLogin}>
        <FormItem name="mobile" className="enter-x" rules={formRules.mobile}>
          <Input size="large" placeholder={t('sys.login.mobile')} className="fix-auto-fill" />
        </FormItem>
        <FormItem name="sms" className="enter-x" rules={formRules.sms}>
          <CountdownInput
            size="large"
            className="fix-auto-fill"
            placeholder={t('sys.login.smsCode')}
          />
        </FormItem>

        <FormItem className="enter-x">
          <Button type="primary" size="large" block={true} loading={loading} htmlType="submit">
            {t('sys.login.loginButton')}
          </Button>
          <Button size="large" block={true} className="mt-4" onClick={handleBackLogin}>
            {t('sys.login.backSignIn')}
          </Button>
        </FormItem>
      </Form>
    </>
  );
};

export default MobileForm;
