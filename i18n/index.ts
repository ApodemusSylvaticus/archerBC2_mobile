import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
// eslint-disable-next-line import/extensions
import translationData from './data.json';

export const { languageSimbolArray } = translationData;

const resources = {};

interface Language {
    simbol: string;
    value: string;
    isLTR: boolean;
}
export const languageArray: Language[] = [];

languageSimbolArray.forEach(el => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resources[el] = { translation: translationData[el].data };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    languageArray.push({ simbol: el, value: translationData[el].name, isLTR: translationData[el].isLTR });
});

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources,

        lng: 'en',
        compatibilityJSON: 'v3',

        interpolation: {
            escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        },
    });

export default i18n;
