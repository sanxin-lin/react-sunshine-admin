import { type ModalProps, useModalInner, BasicModal } from '@/components/Modal';
import { Button } from 'antd';

const ModalExample2 = (props: ModalProps) => {
  const { register: inputRegister } = props;
  const [register, { closeModal, setModalProps }] = useModalInner(inputRegister);
  return (
    <BasicModal
      register={register}
      title="Modal Title"
      helpMessage={['提示1', '提示2']}
      okButtonProps={{ disabled: true }}
    >
      <>
        <Button type="primary" onClick={closeModal} className="mr-2">
          从内部关闭弹窗
        </Button>
        <Button type="primary" onClick={() => setModalProps({ title: 'Modal New Title' })}>
          从内部修改title
        </Button>
      </>
    </BasicModal>
  );
};

export default ModalExample2;
