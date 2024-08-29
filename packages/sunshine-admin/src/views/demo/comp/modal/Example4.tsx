import { type ModalProps, BasicModal, useModalInner } from '@/components/Modal';
import { BasicForm, FormSchema, useForm } from '@/components/Form';
import { useMessage } from '@/hooks/web/useMessage';

const ModalExample4 = (props: ModalProps) => {
  const { register: inputRegister } = props;
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      required: true,
      colProps: {
        span: 12,
      },
      defaultValue: '111',
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      required: true,
      colProps: {
        span: 12,
      },
    },
  ];
  const [registerForm, { setFieldsValue, validateFields }] = useForm({
    labelWidth: 120,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const [register, { closeModal }] = useModalInner(inputRegister, (data) => {
    setFieldsValue({
      field2: data.data,
      field1: data.info,
    });
  });

  const { createMessage } = useMessage();

  const submit = async () => {
    const values = await validateFields();
    createMessage.success(JSON.stringify(values));
    closeModal();
  };
  return (
    <BasicModal
      register={register}
      title="Modal Title"
      helpMessage={['提示1', '提示2']}
      width="700px"
      onOk={submit}
    >
      <BasicForm register={registerForm} />
    </BasicModal>
  );
};

export default ModalExample4;
