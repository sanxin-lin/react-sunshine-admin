import { Radio } from 'antd';

import { BasicForm, useForm } from '@/components/Form';
import { BasicModal, type ModalMethods, type ModalProps, useModalInner } from '@/components/Modal';
import { useLocale } from '@/hooks/web/useLocale';
import { useAppStore, useAppStoreActions } from '@/stores/modules/app';

import { ApiAddress } from '#/store';

interface IProps extends Partial<ModalProps> {
  register: (modalMethod: ModalMethods, uuid: string) => void;
}

const ChangeApi = (props: IProps) => {
  const { register, ...restProps } = props;
  const apiAddress = useAppStore((state) => state.getApiAddress());
  const { setApiAddress } = useAppStoreActions();
  const { t } = useLocale();

  const addresses = {
    development: 'http://www.a.com',
    test: 'http://www.b.com',
    prod: 'http://www.c.com',
  };

  const [_register, { closeModal }] = useModalInner(register, async () => {
    initData();
  });

  const [registerForm, { validateFields, setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    schemas: [
      {
        field: 'api',
        label: t('layout.header.dropdownChangeApi'),
        colProps: {
          span: 24,
        },
        defaultValue: import.meta.env.MODE || 'development', // 当前环境
        required: true,
        component: 'Radio',
        render() {
          return (
            <Radio.Group>
              {Object.keys(addresses).map((key) => (
                <Radio
                  key={addresses[key]}
                  style={{
                    display: 'flex',
                    height: '30px',
                    lineHeight: '30px',
                  }}
                  value={addresses[key]}
                >
                  {key} {addresses[key]}
                </Radio>
              ))}
            </Radio.Group>
          );
        },
      },
    ],
  });
  const handelSubmit = async () => {
    const values = await validateFields();
    console.log(values);
    setApiAddress({
      key: values.api,
      val: addresses[values.api],
    });
    location.reload();
  };
  const handelCancel = () => {
    closeModal();
  };
  const initData = () => {
    const { key = '' } = apiAddress as ApiAddress;
    if (key) {
      setFieldsValue({
        api: key,
      });
    }
  };

  return (
    <BasicModal
      {...(restProps as any)}
      title={t('layout.header.dropdownChangeApi')}
      register={_register}
      onOk={handelSubmit}
      onCancel={handelCancel}
    >
      <BasicForm register={registerForm} />
    </BasicModal>
  );
};

export default ChangeApi;
