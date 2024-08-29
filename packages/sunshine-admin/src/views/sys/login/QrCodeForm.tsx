import { Button, Divider } from 'antd';

import { QrCode } from '@/components/Qrcode';
import { useLocale } from '@/hooks/web/useLocale';

import LoginFormTitle from './LoginFormTitle';
import { useLoginStore } from './store';
import { LoginStateEnum } from './types';

import { BaseProps } from '#/compoments';

interface IProps extends BaseProps {}

const QrCodeForm: React.FC<IProps> = (props) => {
  const { ...wrapperProps } = props;
  const { currentState, handleBackLogin } = useLoginStore();
  const show = currentState === LoginStateEnum.QR_CODE;

  const { t } = useLocale();

  const qrCodeUrl = 'https://rben.vvbin.cn/login';

  if (!show) return null;

  return (
    <div {...wrapperProps}>
      <LoginFormTitle className="enter-x" />
      <div className="enter-x min-w-64 min-h-64">
        <QrCode
          value={qrCodeUrl}
          className="enter-x flex justify-center xl:justify-start"
          width={280}
        />
        <Divider className="enter-x">{t('sys.login.scanSign')}</Divider>
        <Button size="large" block className="mt-4 enter-x" onClick={handleBackLogin}>
          {t('sys.login.backSignIn')}
        </Button>
      </div>
    </div>
  );
};

export default QrCodeForm;
