import { useModal } from '@/components/Modal';
import { PageWrapper } from '@/components/Page';
import { Alert, Button, Space } from 'antd';
import ModalExample1 from './Example1';
import ModalExample2 from './Example2';
import ModalExample3 from './Example3';
import ModalExample4 from './Example4';

const ModalExample = () => {
  const [register1, { openModal: openModal1 }] = useModal();
  const [register2, { openModal: openModal2 }] = useModal();
  const [register3, { openModal: openModal3 }] = useModal();
  const [register4, { openModal: openModal4 }] = useModal();
  // TODO BasicTable
  const [register5, { openModal: openModal5 }] = useModal();

  const send = () => {
    openModal4(true, {
      data: 'content',
      info: 'Info',
    });
  };

  return (
    <PageWrapper title="modal组件使用示例">
      <Alert
        message="使用 useModal 进行弹窗操作，默认可以拖动，可以通过 draggable
    参数进行控制是否可以拖动/全屏，并演示了在Modal内动态加载内容并自动调整高度"
        show-icon
      />
      <Button type="primary" className="my-4" onClick={() => openModal1()}>
        打开弹窗,加载动态数据并自动调整高度(默认可以拖动/全屏)
      </Button>
      <ModalExample1 register={register1} />

      <Alert message="内外同时同时显示隐藏" show-icon />
      <Button type="primary" className="my-4" onClick={() => openModal2()}>
        打开弹窗
      </Button>
      <ModalExample2 register={register2} />

      <Alert message="自适应高度" show-icon />
      <Space>
        <Button type="primary" className="my-4" onClick={() => openModal3()}>
          打开弹窗
        </Button>
        <Button type="primary" className="my-4" onClick={() => openModal5()}>
          打开弹窗（BasicTable）
        </Button>
      </Space>
      <ModalExample3 register={register3} />

      <Alert message="内外数据交互" show-icon />
      <Button type="primary" className="my-4" onClick={send}>
        打开弹窗并传递数据
      </Button>
      <ModalExample4 register={register4} />
    </PageWrapper>
  );
};

export default ModalExample;
