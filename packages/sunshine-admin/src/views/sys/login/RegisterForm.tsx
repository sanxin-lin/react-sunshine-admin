import { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

import { CountdownInput } from '@/components/CountDown';
import { StrengthMeter } from '@/components/StrengthMeter';
import { useLocale } from '@/hooks/web/useLocale';

import LoginFormTitle from './LoginFormTitle';
import { useLoginStore } from './store';
import { LoginStateEnum, RegisterField } from './types';
import { useFormConfigs } from './useFormConfigs';

interface IProps {}

const FormItem = Form.Item<RegisterField>;
const Password = Input.Password;

const RegisterForm: React.FC<IProps> = () => {
  const { form, formRules } = useFormConfigs();
  const { t } = useLocale();
  const { currentState, handleBackLogin } = useLoginStore();
  const [loading, setLoading] = useState(false);

  const show = currentState === LoginStateEnum.REGISTER;

  async function handleRegister(data: RegisterField) {
    setLoading(true);
    console.log(data);
    setLoading(false);
  }

  if (!show) return null;

  return (
    <>
      <LoginFormTitle className="enter-x" />
      <Form
        className="p-4 enter-x"
        form={form}
        initialValues={{
          account: '',
          password: '',
          confirmPassword: null,
          mobile: '',
          sms: '',
          policy: false,
        }}
        onFinish={handleRegister}
        autoComplete="off"
      >
        <FormItem name="account" className="enter-x" rules={formRules.account}>
          <Input className="fix-auto-fill" size="large" placeholder={t('sys.login.userName')} />
        </FormItem>
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
        <FormItem name="password" className="enter-x" rules={formRules.password}>
          <StrengthMeter size="large" placeholder={t('sys.login.password')} />
        </FormItem>

        <FormItem name="confirmPassword" className="enter-x" rules={formRules.confirmPassword}>
          <Password size="large" visibilityToggle placeholder={t('sys.login.confirmPassword')} />
        </FormItem>

        <FormItem
          className="enter-x"
          name="policy"
          rules={formRules.policy}
          valuePropName="checked"
        >
          <Checkbox>{t('sys.login.policy')}</Checkbox>
        </FormItem>

        <Button
          type="primary"
          className="enter-x"
          size="large"
          block
          loading={loading}
          htmlType="submit"
        >
          {t('sys.login.registerButton')}
        </Button>
        <Button size="large" block className="mt-4 enter-x" onClick={handleBackLogin}>
          {t('sys.login.backSignIn')}
        </Button>
      </Form>
    </>
  );
};

export default RegisterForm;
