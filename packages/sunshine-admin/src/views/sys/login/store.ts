import { create } from 'zustand';

import { LoginStateEnum } from './types';

interface LoginStore {
  currentState: LoginStateEnum;
  setLoginState(state: LoginStateEnum): void;
  handleBackLogin(): void;
}

export const useLoginStore = create<LoginStore>((set, get) => ({
  currentState: LoginStateEnum.LOGIN,
  setLoginState(state: LoginStateEnum) {
    set({ currentState: state });
  },
  handleBackLogin() {
    get().setLoginState(LoginStateEnum.LOGIN);
  },
}));
