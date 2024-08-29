import { BasicDrawer, type DrawerProps } from '@/components/Drawer';

const DrawerExample1 = (props: DrawerProps) => {
  return (
    <BasicDrawer {...props} title="Drawer Title" width="50%">
      Drawer Info.
    </BasicDrawer>
  );
};

export default DrawerExample1;
