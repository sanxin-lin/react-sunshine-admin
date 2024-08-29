import { type ModalProps, BasicModal, useModalInner } from '@/components/Modal';
import { Button } from 'antd';
import { useState } from 'react';

const ModalExample1 = (props: ModalProps) => {
  const { register: inputRegister } = props;
  const [register, { setModalProps }] = useModalInner(inputRegister);

  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState(new Array(10).fill(0));
  const updateLines = (count: number) => {
    setLines(new Array(count).fill(0));
  };

  const handleShow = (open: boolean) => {
    if (open) {
      setLoading(true);
      setModalProps({ loading: true, confirmLoading: true });
      setTimeout(() => {
        updateLines(Math.round(Math.random() * 30 + 5));
        setLoading(false);
        setModalProps({ loading: false, confirmLoading: false });
      }, 3000);
    }
  };

  return (
    <BasicModal
      {...props}
      destroyOnClose
      register={register}
      title="Modal Title"
      helpMessage={['提示1', '提示2']}
      onOpenChange={handleShow}
      insertFooter={
        <Button
          type="primary"
          danger
          onClick={() => updateLines(Math.round(Math.random() * 20 + 10))}
          disabled={loading}
        >
          点我更新内容
        </Button>
      }
    >
      {loading ? (
        <div className="h-full text-center line-height-100px">加载中，稍等3秒……</div>
      ) : (
        lines.map((_, index) => <li key={index}>加载完成{index}！</li>)
      )}
    </BasicModal>
  );
};

export default ModalExample1;
