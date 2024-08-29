import { BasicDrawer, type DrawerProps } from '@/components/Drawer';
import { Button } from 'antd';

const DrawerExample3 = (props: DrawerProps) => {
  const handleOk = () => {
    console.log('=====================');
    console.log('ok');
    console.log('======================');
  };

  return (
    <BasicDrawer
      {...props}
      title="Drawer Title"
      showFooter={true}
      width="50%"
      onOk={handleOk}
      insertFooter={<Button>btn1</Button>}
      centerFooter={<Button>btn2</Button>}
      appendFooter={<Button>btn3</Button>}
    >
      <>
        {new Array(40).fill(0).map((_, index) => {
          return (
            <p className="h-10" key={index}>
              根据屏幕高度自适应
            </p>
          );
        })}
      </>
    </BasicDrawer>
  );
};

export default DrawerExample3;
