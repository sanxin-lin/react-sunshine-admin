import { BasicDrawer, type DrawerProps } from '@/components/Drawer';

const DrawerExample5 = (props: DrawerProps) => {
  return (
    <BasicDrawer {...props} isDetail={true} title="Drawer Title" titleToolbar={<div>toolbar</div>}>
      <p className="h-20">Content Message</p>
    </BasicDrawer>
  );
};

export default DrawerExample5;
