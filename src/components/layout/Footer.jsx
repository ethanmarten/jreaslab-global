import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "../../hooks/useLocale";
export default function Footer() {
  const { t, path } = useLocale();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link to={path()} aria-label="Jreas Lab">
              <img
                src="/images/logo.svg"
                width="180"
                height="48"
                alt="Jreas Lab"
                loading="lazy"
              />
            </Link>
            <p>{t("footer.line")}</p>
          </div>
          <nav aria-label={t("footer.social")}>
            {["services", "work", "about", "contact"].map((k) => (
              <Link to={path(`/${k}`)} key={k}>
                {t(`nav.${k}`)}
              </Link>
            ))}
          </nav>
          <div className="footer-contact">
            <a href="mailto:info@jreaslab.com">
              info@jreaslab.com <ArrowUpRight size={16} />
            </a>
            <a
              href="https://wa.me/970597747340"
              target="_blank"
              rel="noreferrer"
            >
              {t("common.whatsapp")} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Jreas Lab. {t("common.rights")}
          </span>
          <div>
            <a
              href="https://www.linkedin.com/company/jreas-lab1/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/jreas_lab/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a href="https://x.com/JreasLab" target="_blank" rel="noreferrer">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
