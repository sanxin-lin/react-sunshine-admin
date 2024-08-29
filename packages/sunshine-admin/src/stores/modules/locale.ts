import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { LOCALE_KEY } from '@/enums/cacheEnum';
import { localeSetting } from '@/settings/localeSetting';
import { createLocalStorage } from '@/utils/cache';

import type { LocaleSetting } from '#/config';

interface LocaleState {
  localInfo: LocaleSetting;
}

interface LocaleAction {
  setLocaleInfo(info: Partial<LocaleSetting>): void;
  initLocale(): Promise<LocaleSetting>;
}

type LocaleStore = LocaleState & LocaleAction;

const ls = createLocalStorage();
const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting;

export const useLocaleStore = create<LocaleStore>((set, get) => ({
  localInfo: lsLocaleSetting,

  /**
   * Set up multilingual information and cache
   * @param info multilingual info
   */
  setLocaleInfo(info: Partial<LocaleSetting>) {
    const localInfo = { ...get().localInfo, ...info };
    set({ localInfo });
    ls.set(LOCALE_KEY, localInfo);
  },
  /**
   * Initialize multilingual information and load the existing configuration from the local cache
   */
  initLocale() {
    return new Promise<LocaleSetting>((resolve) => {
      const localeInfo = {
        ...localeSetting,
        ...get().localInfo,
      };
      get().setLocaleInfo(localeInfo);
      resolve(localeInfo);
    });
  },
}));

export const useLocaleStoreActions = () => {
  return useLocaleStore(
    useShallow((state) => ({
      setLocaleInfo: state.setLocaleInfo,
      initLocale: state.initLocale,
    })),
  );
};
