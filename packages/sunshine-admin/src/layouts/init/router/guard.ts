import { PageEnum } from '@/enums/pageEnum';
import { useGo } from '@/hooks/web/usePage';
import { useRouterListener } from '@/hooks/web/useRouterListener';
import { useUserStore } from '@/stores/modules/user';

export const initGuard = () => {
  const token = useUserStore((state) => state.getToken());
  const go = useGo();
  useRouterListener(() => {
    // 没有 token 返回登录页
    if (!token) {
      go(PageEnum.BASE_LOGIN, true);
    }
  });
};
