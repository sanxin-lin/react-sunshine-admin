import { Outlet } from 'react-router-dom';

import { useRootSetting } from '@/hooks/setting/useRootSetting';

import FrameLayout from '../../iframe/Index';

const Page = () => {
  const { canEmbedIFramePage } = useRootSetting();
  return (
    <>
      <Outlet />
      {canEmbedIFramePage && <FrameLayout />}
    </>
  );
};

export default Page;
