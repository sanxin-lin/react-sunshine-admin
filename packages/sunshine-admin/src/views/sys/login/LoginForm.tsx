import { useState } from 'react';
import {
  AlipayCircleFilled,
  GithubFilled,
  GoogleCircleFilled,
  TwitterCircleFilled,
  WechatFilled,
} from '@ant-design/icons';
import type { CheckboxProps } from 'antd';
import { Button, Checkbox, Col, Divider, Form, Input, Row } from 'antd';

import { PageEnum } from '@/enums/pageEnum';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useMessage } from '@/hooks/web/useMessage';
import { useGo } from '@/hooks/web/usePage';
import { useTranslation } from '@/hooks/web/useTransition';
import { usePermissionStore, usePermissionStoreActions } from '@/stores/modules/permission';
import { useUserStoreActions } from '@/stores/modules/user';

import LoginFormTitle from './LoginFormTitle';
import { useLoginStore } from './store';
import { LoginField, LoginStateEnum } from './types';
import { useFormConfigs } from './useFormConfigs';

const FormItem = Form.Item<LoginField>;

const LoginForm = () => {
  const { login } = useUserStoreActions();
  const { currentState, setLoginState } = useLoginStore();
  const isDynamicAddedRoute = usePermissionStore((state) => state.isDynamicAddedRoute);
  const { setDynamicAddedRoute, buildRoutes } = usePermissionStoreActions();
  const show = currentState === LoginStateEnum.LOGIN;

  const { t } = useLocale();
  const [remember, setRemember] = useState(false);
  const [loading, startLogin] = useTranslation();
  const { prefixCls } = useDesign('login');
  const { formRules, form } = useFormConfigs<LoginField>();
  const go = useGo();

  const { notification, createErrorModal } = useMessage();

  const onRememberChange: CheckboxProps['onChange'] = (e) => {
    setRemember(e.target.checked);
  };

  const onLogin = async () => {
    console.log(remember);
    startLogin(async () => {
      try {
        const data = form.getFieldsValue();
        const userInfo = await login({
          username: data.account,
          password: data.password,
          mode: 'none',
          async afterLoginAction(userInfo) {
            if (userInfo) {
              // 动态路由加载（首次）
              if (!isDynamicAddedRoute) {
                await buildRoutes();
                // 记录动态路由加载完成
                setDynamicAddedRoute(true);
              }
              go(userInfo.homePath || PageEnum.BASE_HOME, true);
            }
          },
        });
        if (userInfo) {
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
            duration: 3,
          });
        }
      } catch (error) {
        createErrorModal({
          title: t('sys.api.errorTip'),
          content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      }
    });
  };

  if (!show) return null;

  return (
    <>
      <LoginFormTitle className="enter-x" />
      <Form
        form={form}
        className="p-4 enter-x"
        initialValues={{
          account: 'sunshine',
          password: '123456',
        }}
        onFinish={onLogin}
      >
        <FormItem name="account" rules={formRules.account}>
          <Input size="large" className="fix-auto-fill" placeholder={t('sys.login.userName')} />
        </FormItem>
        <FormItem name="password" rules={formRules.password}>
          <Input.Password
            size="large"
            visibilityToggle={true}
            placeholder={t('sys.login.password')}
          />
        </FormItem>

        <Row className="enter-x">
          <Col span={12}>
            <FormItem valuePropName="checked">
              <Checkbox defaultChecked={false} onChange={onRememberChange}>
                {t('sys.login.rememberMe')}
              </Checkbox>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem style={{ textAlign: 'right' }}>
              <Button
                type="link"
                size="small"
                onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
              >
                {t('sys.login.forgetPassword')}
              </Button>
            </FormItem>
          </Col>
          <FormItem className="enter-x w-full">
            <Button type="primary" size="large" block={true} htmlType="submit" loading={loading}>
              {t('sys.login.loginButton')}
            </Button>
          </FormItem>
        </Row>
        <Row className="enter-x" gutter={[16, 16]}>
          <Col md={8} xs={24}>
            <Button block={true} onClick={() => setLoginState(LoginStateEnum.MOBILE)}>
              {t('sys.login.mobileSignInFormTitle')}
            </Button>
          </Col>
          <Col md={8} xs={24}>
            <Button block={true} onClick={() => setLoginState(LoginStateEnum.QR_CODE)}>
              {t('sys.login.qrSignInFormTitle')}
            </Button>
          </Col>
          <Col md={8} xs={24}>
            <Button block={true} onClick={() => setLoginState(LoginStateEnum.REGISTER)}>
              {t('sys.login.registerButton')}
            </Button>
          </Col>
        </Row>
        <Divider>{t('sys.login.otherSignIn')}</Divider>

        <div className={`${prefixCls}-sign-in-way flex justify-evenly enter-x`}>
          <GithubFilled />
          <WechatFilled />
          <AlipayCircleFilled />
          <GoogleCircleFilled />
          <TwitterCircleFilled />
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
