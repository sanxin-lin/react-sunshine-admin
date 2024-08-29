import { useLocale } from '@/hooks/web/useLocale';

import { useLoginStore } from './store';
import { LoginStateEnum } from './types';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const LoginFormTitle: React.FC<IProps> = (props: IProps) => {
  const { className = '', ...wrapperProps } = props;
  const { t } = useLocale();
  const { currentState } = useLoginStore();
  const titleObj = {
    [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
    [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
    [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
    [LoginStateEnum.MOBILE]: t('sys.login.mobileSignInFormTitle'),
    [LoginStateEnum.QR_CODE]: t('sys.login.qrSignInFormTitle'),
  };
  const formTitle = titleObj[currentState];

  return (
    <h2
      {...wrapperProps}
      className={`${className} mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left`}
    >
      {formTitle}
    </h2>
  );
};

export default LoginFormTitle;
