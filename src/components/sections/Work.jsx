import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { projects } from "../../data/projects";
import { Arrow, SectionHead, Reveal } from "../ui/Elements";
import ProjectArt from "../ui/ProjectArt";
export function ProjectGrid({ filterable = false }) {
  const { t, lang, path } = useLocale();
  const [filter, setFilter] = useState("all");
  return (
    <>
      {filterable && (
        <div
          className="filters"
          role="group"
          aria-label={lang === "ar" ? "تصنيف المشاريع" : "Filter projects"}
        >
          {["all", "web", "product"].map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {t(`work.filters.${f}`)}
            </button>
          ))}
        </div>
      )}
      <div className="project-grid">
        {projects
          .filter((p) => filter === "all" || p.category === filter)
          .map((p, i) => (
            <Reveal key={p.slug} className={`project-item project-item-${i}`}>
              <Link
                to={path(`/work/${p.slug}`)}
                className="project-card"
                aria-label={`${p[lang].title} — ${t("work.project")}`}
              >
                <div className="project-image">
                  <ProjectArt theme={p.theme} />
                  <span className="project-open">
                    <Arrow size={24} />
                  </span>
                  <span className="project-badge">{t("common.concept")}</span>
                </div>
                <div className="project-meta">
                  <div>
                    <span>{p[lang].category}</span>
                    <h3>{p[lang].title}</h3>
                  </div>
                  <span className="project-index">0{i + 1} / JL</span>
                </div>
                <p>{p[lang].summary}</p>
              </Link>
            </Reveal>
          ))}
      </div>
    </>
  );
}
export default function Work() {
  const { t, path } = useLocale();
  return (
    <section className="section container work-section">
      <SectionHead
        eyebrow={t("work.eyebrow")}
        title={t("work.title")}
        description={t("work.description")}
      >
        <Link className="text-link" to={path("/work")}>
          {t("common.allWork")}
          <Arrow />
        </Link>
      </SectionHead>
      <ProjectGrid />
    </section>
  );
}
