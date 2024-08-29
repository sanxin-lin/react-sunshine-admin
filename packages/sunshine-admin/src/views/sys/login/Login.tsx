import LoginBoxBg from '@/assets/svg/login-box-bg.svg';
import { AppLocalePicker, AppLogo, AppThemeToggle } from '@/components/Application';
import { useGlobSetting } from '@/hooks/setting';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useLocaleStore } from '@/stores/modules/locale';

import ForgetPasswordForm from './ForgetPasswordForm';
import LoginForm from './LoginForm';
import MobileForm from './MobileForm';
import QrCodeForm from './QrCodeForm';
import RegisterForm from './RegisterForm';
import { useResetState } from './useResetState';

import './Login.less';

interface IProps {
  sessionTimeout?: boolean;
}

const Login: React.FC<IProps> = (props) => {
  // 进入登录页时清楚所有状态
  useResetState();

  const { sessionTimeout } = props;
  const { prefixCls } = useDesign('login');
  const { t } = useLocale();
  const showPicker = useLocaleStore((state) => state.localInfo.showPicker);
  const globSetting = useGlobSetting();
  const title = globSetting?.title;
  return (
    <div className={`${prefixCls} relative w-full h-full px-4`}>
      <div className="absolute flex items-center right-4 top-4">
        {!sessionTimeout && <AppThemeToggle className="enter-x mr-2" />}
        {!sessionTimeout && showPicker && (
          <AppLocalePicker showText={false} className="text-white enter-x xl:text-gray-600" />
        )}
      </div>

      <span className="-enter-x xl:hidden">
        <AppLogo alwaysShowTitle={true} />
      </span>

      <div className="container relative h-full py-2 mx-auto sm:px-10">
        <div className="flex h-full">
          <div className="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
            <AppLogo className="-enter-x" />
            <div className="my-auto">
              <img alt={title} src={LoginBoxBg} className="w-1/2 -mt-16 -enter-x" />
              <div className="mt-10 font-medium text-white -enter-x">
                <span className="inline-block mt-4 text-3xl"> {t('sys.login.signInTitle')}</span>
              </div>
              <div className="mt-5 font-normal text-white dark:text-gray-500 -enter-x">
                {t('sys.login.signInDesc')}
              </div>
            </div>
          </div>
          <div className="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
            <div
              className={`${prefixCls}-form relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x`}
            >
              <LoginForm />
              <ForgetPasswordForm />
              <QrCodeForm />
              <MobileForm />
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
