import { useLocale } from "../../hooks/useLocale";
import { Button } from "../ui/Elements";
export default function CallToAction() {
  const { t, path } = useLocale();
  return (
    <section className="cta">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">
            <i />
            JREAS LAB
          </span>
          <h2 className="multiline">{t("cta.title")}</h2>
          <p>{t("cta.description")}</p>
        </div>
        <Button to={path("/contact")}>{t("common.start")}</Button>
      </div>
    </section>
  );
}
