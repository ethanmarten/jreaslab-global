import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
export function useLocale() {
  const { pathname } = useLocation();
  const lang = pathname.split("/")[1] === "en" ? "en" : "ar";
  const { t } = useTranslation();
  return {
    lang,
    t,
    dir: lang === "ar" ? "rtl" : "ltr",
    path: (p = "") => `/${lang}${p}`,
  };
}
