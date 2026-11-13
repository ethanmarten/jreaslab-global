import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "../../hooks/useLocale";
import { THEME_EVENT } from "../../utils/theme";
import ThemeToggle from "../ui/ThemeToggle";
import styles from "./Header.module.css";
const items = ["home", "services", "work", "about", "contact"];
export default function Header() {
  const { lang, t, path, dir } = useLocale();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const header = useRef();
  const toggle = useRef();
  const panel = useRef();
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const y = window.scrollY;
      setScrolled((current) => (current ? y > 32 : y > 110));
      const bottom = header.current?.getBoundingClientRect().bottom || 80;
      const behind = document.elementFromPoint(
        window.innerWidth / 2,
        bottom + 6,
      );
      const darkSection = behind?.closest(
        ".services-section, .footer, .studio-wall",
      );
      setOnLight(
        document.documentElement.dataset.theme !== "dark" &&
          y > 110 &&
          !darkSection,
      );
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener(THEME_EVENT, schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener(THEME_EVENT, schedule);
    };
  }, []);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 992px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = panel.current?.querySelectorAll("a,button");
    controls?.[0]?.focus();
    function keys(e) {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const first = toggle.current,
          last = controls?.[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    function outside(e) {
      if (!header.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("keydown", keys);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", keys);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  const other =
    location.pathname.replace(/^\/(ar|en)/, lang === "ar" ? "/en" : "/ar") +
    location.search;
  const nav = () =>
    items.map((item) => (
      <NavLink
        key={item}
        end={item === "home"}
        to={path(item === "home" ? "" : `/${item}`)}
        onClick={() => setOpen(false)}
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        {t(`nav.${item}`)}
      </NavLink>
    ));
  const language = () => (
    <Link
      to={other}
      className={styles.language}
      lang={lang === "ar" ? "en" : "ar"}
      aria-label={lang === "ar" ? "English" : "العربية"}
      onClick={() => setOpen(false)}
    >
      {lang === "ar" ? "EN" : "ع"}
    </Link>
  );
  return (
    <header
      ref={header}
      className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${onLight ? styles.onLight : ""}`}
    >
      <div className={styles.bar} dir="ltr">
        <Link
          to={path()}
          className={styles.brand}
          onClick={() => setOpen(false)}
          aria-label="Jreas Lab"
        >
          <img
            className={styles.symbol}
            src="/images/symbol.svg"
            width="42"
            height="38"
            alt=""
          />
          <span className={styles.wordmark}>
            <img src="/images/wordmark.svg" width="126" height="26" alt="" />
          </span>
        </Link>
        <nav
          className={styles.desktop}
          dir={dir}
          aria-label={lang === "ar" ? "التنقل الرئيسي" : "Main navigation"}
        >
          {nav()}
        </nav>
        <div className={styles.actions}>
          <div className={styles.desktopTools}>
            {language()}
            <ThemeToggle className={styles.theme} />
          </div>
          <Link
            to={path("/contact")}
            className={styles.contact}
            onClick={() => setOpen(false)}
            dir={dir}
          >
            {t("nav.talk")}
            <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
          <button
            ref={toggle}
            type="button"
            className={styles.toggle}
            aria-label={t(open ? "common.close" : "common.menu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            ref={panel}
            className={styles.mobile}
            dir={dir}
            aria-label={t("common.menu")}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {nav()}
            <div className={styles.mobileTools}>
              <span>{t("common.appearance")}</span>
              <ThemeToggle className={styles.theme} />
              {language()}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
