import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, getI18n } from 'react-i18next';
import COMMON_KO from './common/ko.json';
import COMMON_EN from './common/en.json';

// const language = new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'ko';

export const i18nGlobal = i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: 'common',
    ns: ['common', 'sky'],
    resources: {
      ko: { common: COMMON_KO },
      en: { common: COMMON_EN },
    },
    // lng: language,
    fallbackLng: "ko",
    interpolation: {
      escapeValue: false,
    },
    debug: false,
    detection: {
      lookupQuerystring: 'lang',
    }
  }).then(async () => {
    const i18n = getI18n();

    const [SKY_KO, GUI_KO, OTYPE_KO] = await Promise.all([
      fetch('/i18n/ko-sky.json').then((res) => res.json()),
      fetch('/i18n/ko-gui.json').then((res) => res.json()),
      fetch('/i18n/ko-otype.json').then((res) => res.json()),
    ]);

    i18n.addResources('ko', 'sky', SKY_KO);
    i18n.addResources('ko', 'gui', GUI_KO);
    i18n.addResources('ko', 'otype', OTYPE_KO);
  });