import { BasicDrawer, type DrawerProps } from '@/components/Drawer';
import { useDrawerInner } from '@/components/Drawer';
import { Button } from 'antd';

const DrawerExample2 = (props: DrawerProps) => {
  const { register: inputRegister } = props;
  const [register, { closeDrawer }] = useDrawerInner(inputRegister);
  return (
    <BasicDrawer {...props} register={register} title="Drawer Title" width="50%">
      <span>Drawer Info.</span>
      <Button type="primary" onClick={closeDrawer}>
        内部关闭drawer
      </Button>
    </BasicDrawer>
  );
};

export default DrawerExample2;
