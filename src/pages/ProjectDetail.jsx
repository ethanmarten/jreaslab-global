import { Link, useParams } from "react-router-dom";
import { useLocale } from "../hooks/useLocale";
import { projects } from "../data/projects";
import { PageHeading, Arrow, Button } from "../components/ui/Elements";
import ProjectArt from "../components/ui/ProjectArt";
import NotFound from "./NotFound";
export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, lang, path } = useLocale();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) return <NotFound />;
  const p = projects[index],
    c = p[lang],
    next = projects[(index + 1) % projects.length];
  return (
    <>
      <PageHeading
        eyebrow={`${t("common.concept")} / ${c.category}`}
        title={c.title}
        description={c.summary}
      />
      <div className="container detail-content">
        <div className="project-notice">
          <span>{t("work.notice")}</span>
          <p>{c.note}</p>
        </div>
        <ProjectArt theme={p.theme} large />
        <div className="case-grid">
          <section>
            <span className="eyebrow">
              <i />
              01
            </span>
            <h2>{t("work.challenge")}</h2>
            <p>{c.challenge}</p>
          </section>
          <section>
            <span className="eyebrow">
              <i />
              02
            </span>
            <h2>{t("work.approach")}</h2>
            <p>{c.approach}</p>
          </section>
          <section>
            <span className="eyebrow">
              <i />
              03
            </span>
            <h2>{t("work.deliverables")}</h2>
            <ul>
              {c.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
        </div>
        <div className="case-bottom">
          <Button to={path("/contact")}>{t("common.start")}</Button>
          <Link className="text-link" to={path(`/work/${next.slug}`)}>
            {t("common.next")} — {next[lang].title}
            <Arrow />
          </Link>
        </div>
      </div>
    </>
  );
}
