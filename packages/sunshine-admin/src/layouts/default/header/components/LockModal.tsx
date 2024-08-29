import { Button } from 'antd';

import headerImg from '@/assets/images/header.jpg';
import { BasicForm, useForm } from '@/components/Form';
import { BasicModal, type ModalMethods, type ModalProps, useModalInner } from '@/components/Modal';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useLockStoreActions } from '@/stores/modules/lock';
import { useUserStore } from '@/stores/modules/user';

import './LockModal.less';

interface IProps extends Partial<ModalProps> {
  register: (modalMethod: ModalMethods, uuid: string) => void;
}

const LockModal = (props: IProps) => {
  const { register, ...resetProps } = props;
  const { t } = useLocale();
  const { prefixCls } = useDesign('header-lock-modal');

  const userInfo = useUserStore((state) => state.getUserInfo());
  const { setLockInfo } = useLockStoreActions();
  const [_register, { closeModal }] = useModalInner(register);

  const [registerForm, { validateFields, resetFields }] = useForm<{
    password: string;
  }>({
    showActionButtonGroup: false,
    autoSetPlaceHolder: true,
    schemas: [
      {
        field: 'password',
        label: t('layout.header.lockScreenPassword'),
        colProps: {
          span: 24,
        },
        component: 'InputPassword',
        required: true,
      },
    ],
  });

  const handleLock = async () => {
    const { password = '' } = await validateFields();

    closeModal();

    setLockInfo({
      isLock: true,
      pwd: password,
    });
    resetFields();
  };

  const avatar = (() => {
    const { avatar } = userInfo;
    return avatar || headerImg;
  })();

  return (
    <BasicModal
      {...(resetProps as any)}
      footer={null}
      title={t('layout.header.lockScreen')}
      className={prefixCls}
      register={_register}
      onCancel={closeModal}
    >
      <div className={`${prefixCls}__entry`}>
        <div className={`${prefixCls}__header`}>
          <img src={avatar} className={`${prefixCls}__header-img`} />
          <p className={`${prefixCls}__header-name`}>{userInfo.realName}</p>
        </div>

        <BasicForm register={registerForm} />

        <div className={`${prefixCls}__footer`}>
          <Button type="primary" block className="mt-2" onClick={handleLock}>
            {t('layout.header.lockScreenBtn')}
          </Button>
        </div>
      </div>
    </BasicModal>
  );
};

export default LockModal;
