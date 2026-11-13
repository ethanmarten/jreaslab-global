import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { getTheme, setTheme, subscribeTheme } from "../../utils/theme";
import { useLocale } from "../../hooks/useLocale";
const serverTheme = () => "light";
export default function ThemeToggle({ className }) {
  const { t } = useLocale();
  const theme = useSyncExternalStore(subscribeTheme, getTheme, serverTheme);
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className={className}
      aria-pressed={dark}
      aria-label={t(dark ? "common.lightMode" : "common.darkMode")}
      title={t(dark ? "common.lightMode" : "common.darkMode")}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? (
        <Sun size={17} aria-hidden="true" />
      ) : (
        <Moon size={17} aria-hidden="true" />
      )}
    </button>
  );
}
