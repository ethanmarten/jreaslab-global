import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';
export function createI18n(lang='ar') {
 const instance=i18next.createInstance();
 instance.use(initReactI18next).init({resources,lng:lang,fallbackLng:'ar',initImmediate:false,interpolation:{escapeValue:false},react:{useSuspense:false}});
 return instance;
}
