import { useDrawer } from '@/components/Drawer';
import { PageWrapper } from '@/components/Page';
import { Alert, Button } from 'antd';
import DrawerExample1 from './Example1';
import DrawerExample2 from './Example2';
import DrawerExample3 from './Example3';
import DrawerExample4 from './Example4';
import DrawerExample5 from './Example5';

const DrawerExample = () => {
  const [register1, { openDrawer: openDrawer1, setDrawerProps }] = useDrawer();
  const [register2, { openDrawer: openDrawer2 }] = useDrawer();
  const [register3, { openDrawer: openDrawer3 }] = useDrawer();
  const [register4, { openDrawer: openDrawer4 }] = useDrawer();
  const [register5, { openDrawer: openDrawer5 }] = useDrawer();
  const openDrawerLoading = () => {
    openDrawer1();
    setDrawerProps({ loading: true });
    setTimeout(() => {
      setDrawerProps({ loading: false });
    }, 2000);
  };
  const send = () => {
    openDrawer4(true, {
      data: 'content',
      info: 'Info',
    });
  };

  return (
    <PageWrapper title="抽屉组件使用示例">
      <Alert message="使用 useDrawer 进行抽屉操作" showIcon />
      <Button type="primary" className="my-4" onClick={openDrawerLoading}>
        打开Drawer
      </Button>
      <DrawerExample1 register={register1} />

      <Alert message="内外同时控制显示隐藏" showIcon />
      <Button type="primary" className="my-4" onClick={() => openDrawer2(true)}>
        打开Drawer
      </Button>
      <DrawerExample2 register={register2} />

      <Alert message="自适应高度/显示footer" showIcon />
      <Button type="primary" className="my-4" onClick={() => openDrawer3(true)}>
        打开Drawer
      </Button>
      <DrawerExample3 register={register3} />

      <Alert message="内外数据交互" showIcon />
      <Button type="primary" className="my-4" onClick={send}>
        打开Drawer并传递数据
      </Button>
      <DrawerExample4 register={register4} />

      <Alert message="详情页模式" showIcon />
      <Button type="primary" className="my-4" onClick={() => openDrawer5(true)}>
        打开详情Drawer
      </Button>
      <DrawerExample5 register={register5} />
    </PageWrapper>
  );
};

export default DrawerExample;
