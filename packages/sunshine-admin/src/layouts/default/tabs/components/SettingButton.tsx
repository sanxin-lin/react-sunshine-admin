import { useDrawer } from '@/components/Drawer';
import { Icon } from '@/components/Icon';
import { useDesign } from '@/hooks/web/useDesign';

import SettingDrawer from '../../setting/SettingDrawer';

const SettingButton = () => {
  const { prefixCls } = useDesign('multiple-tabs-content');

  const [register, { openDrawer }] = useDrawer();

  return (
    <>
      <span className={`${prefixCls}__extra-fold`} onClick={() => openDrawer(true)}>
        <Icon icon="ion:settings-outline" />
      </span>
      <SettingDrawer register={register} />
    </>
  );
};

export default SettingButton;
