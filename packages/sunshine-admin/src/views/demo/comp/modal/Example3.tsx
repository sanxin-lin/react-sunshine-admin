import { type ModalProps, BasicModal } from '@/components/Modal';

const ModalExample3 = (props: ModalProps) => {
  const { register } = props;
  const arr = new Array(20).fill(0);
  return (
    <BasicModal
      register={register}
      title="Modal Title"
      helpMessage={['提示1', '提示2']}
      width="700px"
    >
      <>
        {arr.map((item) => (
          <p className="h-10" key={item}>
            根据屏幕高度自适应
          </p>
        ))}
      </>
    </BasicModal>
  );
};

export default ModalExample3;
