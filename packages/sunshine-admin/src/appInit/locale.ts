import { initReactI18next } from 'react-i18next';
import { useMount } from 'ahooks';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { setHtmlPageLang } from '@/locales/helper';
import en from '@/locales/lang/en';
import zh_CN from '@/locales/lang/zh_CN';
import { useLocaleStoreActions } from '@/stores/modules/locale';

export function initAppLocale() {
  const { initLocale } = useLocaleStoreActions();
  useMount(() => {
    // 初始化过就不初始化了
    if (i18n.isInitialized) return;
    // init store
    initLocale().then((localeInfo) => {
      setHtmlPageLang(localeInfo.locale);
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
          lng: localeInfo.locale,
          interpolation: {
            escapeValue: false,
          },
          resources: {
            en: {
              translation: {
                ...en.message,
              },
            },
            zh: {
              translation: {
                ...zh_CN.message,
              },
            },
          },
        });
    });
  });
}
