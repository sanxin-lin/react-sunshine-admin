import { isArray } from 'lodash-es';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { GetUserInfoModel, LoginParams } from '@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi } from '@/api/sys/user';
// import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { PageEnum } from '@/enums/pageEnum';
import { RoleEnum } from '@/enums/roleEnum';
import { routerEmitter } from '@/hooks/web/routerEmitterEvents';
import { getAuthCache, setAuthCache } from '@/utils/auth';

import type { ErrorMessageMode } from '#/axios';
import { Nullable } from '#/global';
import type { UserInfo } from '#/store';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

interface UserGetter {
  getUserInfo(): UserInfo;
  getToken(): string;
  getRoleList(): RoleEnum[];
  getSessionTimeout(): boolean;
}

interface UserAction {
  setToken(info: string | undefined): void;
  setRoleList(roleList: RoleEnum[]): void;
  setUserInfo(info: UserInfo | null): void;
  setSessionTimeout(flag: boolean): void;
  resetState(): void;
  login(
    params: LoginParams & {
      mode?: ErrorMessageMode;
      afterLoginAction?: (userInfo: Nullable<UserInfo>) => Promise<void>;
    },
  ): Promise<GetUserInfoModel | null>;
  getUserInfoAction(): Promise<UserInfo | null>;
  logout(redirect?: boolean): Promise<void>;
}

type UserStore = UserState & UserGetter & UserAction;

export const useUserStore = create<UserStore>((set, get) => ({
  // user info
  userInfo: null,
  // token
  token: undefined,
  // roleList
  roleList: [],
  // Whether the login expired
  sessionTimeout: false,
  // Last fetch time
  lastUpdateTime: 0,

  getUserInfo() {
    return get().userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
  },
  getToken() {
    return get().token || getAuthCache<string>(TOKEN_KEY);
  },
  getRoleList() {
    const roleList = get().roleList;
    return roleList.length > 0 ? roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
  },
  getSessionTimeout() {
    return !!get().sessionTimeout;
  },

  setToken(info: string | undefined) {
    set({ token: info ? info : '' }); // for null or undefined value
    setAuthCache(TOKEN_KEY, info);
  },
  setRoleList(roleList: RoleEnum[]) {
    set({
      roleList,
    });
    setAuthCache(ROLES_KEY, roleList);
  },
  setUserInfo(info: UserInfo | null) {
    set({
      userInfo: info,
      lastUpdateTime: new Date().getTime(),
    });
    setAuthCache(USER_INFO_KEY, info);
  },
  setSessionTimeout(flag: boolean) {
    set({ sessionTimeout: flag });
  },
  resetState() {
    set({
      userInfo: null,
      token: '',
      roleList: [],
      sessionTimeout: false,
    });
  },
  /**
   * @description: login
   */
  async login(params): Promise<any> {
    try {
      const { mode, afterLoginAction, ...loginParams } = params;
      const { setToken, getUserInfoAction, sessionTimeout } = get();
      const data = await loginApi(loginParams, mode);
      const { token } = data;
      // save token
      setToken(token);
      const userInfo = await getUserInfoAction();
      set({
        userInfo,
      });
      if (sessionTimeout) {
        set({
          sessionTimeout: false,
        });
      } else {
        afterLoginAction?.(userInfo);
      }
      return userInfo;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getUserInfoAction() {
    const { getToken, setRoleList, setUserInfo } = get();
    if (!getToken()) return null;
    const userInfo = await getUserInfo();
    const { roles = [] } = userInfo;
    if (isArray(roles)) {
      const roleList = roles.map((item) => item.value) as RoleEnum[];
      setRoleList(roleList);
    } else {
      userInfo.roles = [];
      setRoleList([]);
    }
    setUserInfo(userInfo);
    return userInfo;
  },
  /**
   * @description: logout
   */
  async logout(redirect = false) {
    const { getToken, setToken, setSessionTimeout, setUserInfo } = get();
    if (getToken()) {
      try {
        await doLogout();
      } catch {
        console.log('注销Token失败');
      }
    }
    setToken(undefined);
    setSessionTimeout(false);
    setUserInfo(null);

    // 直接回登陆页
    routerEmitter.emit('out-navigate', {
      path: PageEnum.BASE_LOGIN,
      replace: true,
    });

    if (redirect) {
      // // TODO 回登陆页带上当前路由地址
      // router.replace({
      //   path: PageEnum.BASE_LOGIN,
      //   query: {
      //     redirect: encodeURIComponent(router.currentRoute.value.fullPath),
      //   },
      // });
    }
  },
}));

export const useUserStoreActions = () => {
  return useUserStore(
    useShallow((state) => ({
      setToken: state.setToken,
      setRoleList: state.setRoleList,
      setUserInfo: state.setUserInfo,
      setSessionTimeout: state.setSessionTimeout,
      resetState: state.resetState,
      login: state.login,
      getUserInfoAction: state.getUserInfoAction,
      logout: state.logout,
    })),
  );
};
