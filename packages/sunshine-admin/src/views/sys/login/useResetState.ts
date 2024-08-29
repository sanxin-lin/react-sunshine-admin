import { useMount } from 'ahooks';

import { useAppStoreActions } from '@/stores/modules/app';
import { useMultipleTabStoreActions } from '@/stores/modules/multipleTab';
import { usePermissionStoreActions } from '@/stores/modules/permission';
import { useUserStoreActions } from '@/stores/modules/user';

export const useResetState = () => {
  const { resetState: resetUserStore } = useUserStoreActions();
  const { resetState: resetMultipleTabStore } = useMultipleTabStoreActions();
  const { resetAllState: resetAppStore } = useAppStoreActions();
  const { resetState: resetPermissionStore } = usePermissionStoreActions();

  useMount(() => {
    resetUserStore();
    resetMultipleTabStore();
    resetAppStore();
    resetPermissionStore();
  });
};
