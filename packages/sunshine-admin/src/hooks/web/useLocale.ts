import { useTranslation } from 'react-i18next';

import { loadLocalePool } from '@/locales';
import { setHtmlPageLang } from '@/locales/helper';
import { useLocaleStore, useLocaleStoreActions } from '@/stores/modules/locale';

import type { LocaleType } from '#/config';

export const useLocale = () => {
  const { t, i18n } = useTranslation();
  const { locale, showPicker } = useLocaleStore((state) => ({
    locale: state.localInfo.locale,
    showPicker: state.localInfo.showPicker,
  }));
  const { setLocaleInfo } = useLocaleStoreActions();

  const changeLocale = async (locale: LocaleType) => {
    const currentLocale = i18n.language;
    if (locale === currentLocale || !loadLocalePool.includes(locale)) return locale;
    console.log(locale);
    await i18n.changeLanguage(locale);
    setLocaleInfo({ locale });
    setHtmlPageLang(locale);
    return locale;
  };

  return {
    t,
    changeLocale,
    locale,
    showPicker,
  };
};
