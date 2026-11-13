import { Link } from "react-router-dom";
import {
  Globe,
  Smartphone,
  PenTool,
  Shapes,
  Megaphone,
  ChartNoAxesCombined,
} from "lucide-react";
import { useLocale } from "../../hooks/useLocale";
import { services } from "../../data/services";
import { SectionHead, Arrow, Reveal } from "../ui/Elements";
const icons = {
  Globe,
  Smartphone,
  PenTool,
  Shapes,
  Megaphone,
  ChartNoAxesCombined,
};
export function ServiceList() {
  const { t, lang, path } = useLocale();
  return (
    <div className="service-list">
      {services.map((s, i) => {
        const Icon = icons[s.icon] || Globe;
        return (
          <Reveal key={s.slug}>
            <Link
              to={path(`/services/${s.slug}`)}
              className={`service-row service-${i}`}
            >
              <span className="service-number">0{i + 1}</span>
              <div className="service-icon">
                <Icon size={30} strokeWidth={1.4} />
                <div className="service-decoration" />
              </div>
              <h3>{s[lang].title}</h3>
              <p>{s[lang].short}</p>
              <span className="service-link">
                <span>{t("common.explore")}</span>
                <Arrow size={25} />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
export default function Services() {
  const { t } = useLocale();
  return (
    <section className="services-section section">
      <div className="container">
        <SectionHead
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          description={t("services.description")}
        />
        <ServiceList />
      </div>
    </section>
  );
}
