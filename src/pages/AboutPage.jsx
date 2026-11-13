import { useLocale } from "../hooks/useLocale";
import { PageHeading } from "../components/ui/Elements";
import Process from "../components/sections/Process";
import CallToAction from "../components/sections/CallToAction";
export default function AboutPage() {
  const { t } = useLocale();
  return (
    <>
      <PageHeading
        eyebrow={t("nav.about")}
        title={t("about.title")}
        description={t("about.description")}
      />
      <section className="container about-story">
        <div className="studio-wall" aria-hidden="true">
          <span>
            JREAS
            <br />
            LAB
          </span>
          <img src="/favicon.svg" alt="" width="280" height="280" />
          <small>DESIGN / BUILD / REFINE</small>
        </div>
        <div className="about-prose">
          <p>{t("about.body")}</p>
          <p>{t("about.global")}</p>
        </div>
      </section>
      <section className="container section values-grid">
        {t("about.values", { returnObjects: true }).map((v, i) => (
          <article key={v.title}>
            <span>0{i + 1}</span>
            <h2>{v.title}</h2>
            <p>{v.text}</p>
          </article>
        ))}
      </section>
      <Process />
      <CallToAction />
    </>
  );
}
