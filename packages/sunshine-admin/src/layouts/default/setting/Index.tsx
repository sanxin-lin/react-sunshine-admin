import { useDrawer } from '@/components/Drawer';
import { Icon } from '@/components/Icon';

import SettingDrawer from './SettingDrawer';

interface IProps {
  className?: string;
}

const Index = (props: IProps) => {
  const [register, { openDrawer }] = useDrawer();

  return (
    <>
      <div {...props} onClick={() => openDrawer(true)}>
        <Icon icon="ion:settings-outline" />
      </div>
      <SettingDrawer register={register} />
    </>
  );
};

export default Index;
