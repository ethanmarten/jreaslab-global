import { useParams, Link } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import { useLocale } from "../hooks/useLocale";
import { services } from "../data/services";
import { PageHeading, Button } from "../components/ui/Elements";
import NotFound from "./NotFound";
export default function ServiceDetail() {
  const { slug } = useParams();
  const { t, lang, path } = useLocale();
  const service = services.find((s) => s.slug === slug);
  if (!service) return <NotFound />;
  const s = service[lang];
  return (
    <>
      <PageHeading
        eyebrow={t("nav.services")}
        title={s.title}
        description={s.intro}
      />
      <div className="container detail-content">
        <Link className="text-link back-link" to={path("/services")}>
          <ArrowLeft size={16} />
          {t("common.allServices")}
        </Link>
        <section className="detail-grid">
          <div>
            <span className="eyebrow">
              <i />
              01
            </span>
            <h2>{t("services.subservices")}</h2>
          </div>
          <ul className="feature-list">
            {s.subservices.map((v) => (
              <li key={v}>
                <Check size={18} />
                {v}
              </li>
            ))}
          </ul>
        </section>
        <section className="detail-grid deliverables">
          <div>
            <span className="eyebrow">
              <i />
              02
            </span>
            <h2>{t("services.deliverables")}</h2>
          </div>
          <ul className="feature-list">
            {s.deliverables.map((v) => (
              <li key={v}>
                <Check size={18} />
                {v}
              </li>
            ))}
          </ul>
        </section>
        <section className="service-method">
          <span className="eyebrow">
            <i />
            03
          </span>
          <h2>{t("services.method")}</h2>
          <div>
            {s.steps.map((v, i) => (
              <article key={v}>
                <b>0{i + 1}</b>
                <p>{v}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <section className="cta">
        <div className="container service-cta">
          <div>
            <h2>{t("services.cta")}</h2>
            <p>{t("services.ctaDescription")}</p>
          </div>
          <Button to={path(`/contact?service=${slug}`)}>
            {t("common.start")}
          </Button>
        </div>
      </section>
    </>
  );
}
