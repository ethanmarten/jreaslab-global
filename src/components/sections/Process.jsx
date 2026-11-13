import { useState, useId } from "react";
import { Plus, Minus } from "lucide-react";
import { useLocale } from "../../hooks/useLocale";
import { SectionHead } from "../ui/Elements";
export default function Process() {
  const { t } = useLocale();
  const [active, setActive] = useState(0);
  const id = useId();
  const steps = t("process.steps", { returnObjects: true });
  return (
    <section className="process-section section">
      <div className="container">
        <SectionHead
          eyebrow={t("process.eyebrow")}
          title={t("process.title")}
          description={t("process.description")}
        />
        <div className="process-layout">
          <div className="process-art" aria-hidden="true">
            <div className="process-track">
              {steps.map((_, i) => (
                <span key={i} className={i === active ? "current" : ""}>
                  <i />0{i + 1}
                </span>
              ))}
            </div>
            <div className="process-big-number">
              0{active + 1}
              <span>/ 05</span>
            </div>
            <span className="process-caption">
              JREAS LAB — {new Date().getFullYear()}
            </span>
          </div>
          <div className="process-list">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`process-step ${i === active ? "is-open" : ""}`}
              >
                <h3>
                  <button
                    id={`${id}-button-${i}`}
                    aria-expanded={active === i}
                    aria-controls={`${id}-panel-${i}`}
                    onClick={() => setActive(i)}
                  >
                    <span className="step-number">0{i + 1}</span>
                    {s.title}
                    {active === i ? (
                      <Minus aria-hidden="true" />
                    ) : (
                      <Plus aria-hidden="true" />
                    )}
                  </button>
                </h3>
                <div
                  id={`${id}-panel-${i}`}
                  role="region"
                  aria-labelledby={`${id}-button-${i}`}
                  hidden={active !== i}
                >
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
