import { initReactI18next } from 'react-i18next';
import { useMount } from 'ahooks';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { get } from 'lodash-es';

import { useLocaleStore } from '@/stores/modules/locale';

import en from './lang/en';
import zh_CN from './lang/zh_CN';

import { LocaleType } from '#/config';

export const EN_LOCALE_DATA = en;
export const ZH_LOCALE_DATA = zh_CN;

export const loadLocalePool: LocaleType[] = ['zh', 'en'];

const LOCALE_DATA = {
  en: EN_LOCALE_DATA,
  zh: ZH_LOCALE_DATA,
};

export const getLocaleMessage = ({ locale, path }: { locale: LocaleType; path: string }) => {
  const localeData = LOCALE_DATA[locale];
  if (!localeData) return path;
  return get(localeData.message, path);
};

// 组件外的 i18n
export const translatorWithout = (path: string) => {
  const locale = useLocaleStore.getState().localInfo.locale;
  return getLocaleMessage({ locale, path });
};

export const initI18n = () => {
  const locale = useLocaleStore((state) => state.localInfo.locale);
  useMount(() => {
    i18n
      // 检测用户当前使用的语言
      // 文档: https://github.com/i18next/i18next-browser-languageDetector
      .use(LanguageDetector)
      // 注入 react-i18next 实例
      .use(initReactI18next)
      // 初始化 i18next
      // 配置参数的文档: https://www.i18next.com/overview/configuration-options
      .init({
        debug: true,
        // fallbackLng: 'zh_CN',
        lng: locale,
        interpolation: {
          escapeValue: false,
        },
        resources: {
          en: {
            translation: {
              ...EN_LOCALE_DATA.message,
            },
          },
          zh: {
            translation: {
              ...ZH_LOCALE_DATA.message,
            },
          },
        },
      });
  });
};
