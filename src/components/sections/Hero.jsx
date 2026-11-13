import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { useLocale } from "../../hooks/useLocale";
import { Button, Arrow } from "../ui/Elements";
import styles from "./Hero.module.css";
export default function Hero() {
  const { t, path, lang } = useLocale();
  return (
    <section className={`${styles.hero} container`}>
      <div className={styles.topline}>
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <span className={styles.edition}>JREAS LAB</span>
      </div>
      <div className={styles.grid}>
        <div className={styles.copy}>
          <motion.h1 initial={{ y: 12 }} animate={{ y: 0 }}>
            <span>{t("hero.line1")}</span>
            <span className={styles.accent}>{t("hero.line2")}</span>
          </motion.h1>
          <p>{t("hero.description")}</p>
          <div className={styles.buttons}>
            <Button to={path("/contact")}>{t("common.start")}</Button>
            <Link className="text-link" to={path("/work")}>
              {t("common.allWork")}
              <Arrow />
            </Link>
          </div>
          <div className={styles.note}>
            <span className={styles.noteLine} />
            {t("hero.note")}
          </div>
        </div>
        <div className={styles.visual} role="img" aria-label={t("hero.visual")}>
          <div className={styles.posterHeader}>
            <span>JREAS LAB</span>
            <span>
              {lang === "ar" ? "تصميم وتطوير" : "DESIGN & DEVELOPMENT"}
            </span>
          </div>
          <motion.img
            className={styles.brandSymbol}
            src="/images/symbol.svg"
            alt=""
            width="282"
            height="250"
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          />
          <div className={styles.posterFooter}>
            <p>
              {lang === "ar"
                ? "من الفكرة، إلى منتج يعمل."
                : "From the brief to the build."}
            </p>
            <span>
              {lang === "ar"
                ? "مواقع الويب · التطبيقات · الهوية البصرية"
                : "WEBSITES · APPS · VISUAL IDENTITY"}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <a href="#studio-intro">
          {t("hero.scroll")}
          <ArrowDown size={16} />
        </a>
        <span>{t("hero.visualTag")}</span>
      </div>
    </section>
  );
}
