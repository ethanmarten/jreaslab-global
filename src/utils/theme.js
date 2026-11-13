export const THEME_KEY = "jreas-theme";
export const THEME_EVENT = "jreas:themechange";

function storedTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}
function preferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
export function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
export function setTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0d171c" : "#f5f6f2");
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* Theme works without storage. */
    }
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
export function subscribeTheme(callback) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (!storedTheme()) setTheme(preferredTheme(), false);
  };
  const onStorage = (event) => {
    if (event.key === THEME_KEY || event.key === null)
      setTheme(storedTheme() || preferredTheme(), false);
  };
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystemChange);
  };
}
