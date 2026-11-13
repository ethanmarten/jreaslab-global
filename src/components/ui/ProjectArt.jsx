import { useLocale } from "../../hooks/useLocale";
export default function ProjectArt({ theme = "commerce", large = false }) {
  const { lang } = useLocale();
  const ar = lang === "ar";
  return (
    <div
      className={`project-art art-${theme} ${large ? "art-large" : ""}`}
      aria-hidden="true"
      dir="ltr"
    >
      {theme === "commerce" ? (
        <>
          <span className="art-orbit" />
          <div className="shop-window">
            <div className="window-nav">
              <b>NŪR</b>
              <span>{ar ? "المجموعة الجديدة" : "THE NEW COLLECTION"}</span>
              <span>＋</span>
            </div>
            <div className="shop-body">
              <div>
                <small>{ar ? "أشياء تُشبهك" : "OBJECTS WITH CHARACTER"}</small>
                <strong>
                  {ar ? "تفاصيل\nتسكن المكان." : "Made for\nyour everyday."}
                </strong>
                <span className="mini-cta">
                  {ar ? "اكتشف المجموعة" : "Explore collection"} ↗
                </span>
              </div>
              <div className="vase">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="shop-bottom">
              <span>01 — 03</span>
              <span>NŪR / OBJECTS</span>
            </div>
          </div>
          <div className="floating-stamp">
            N<br />
            <span>ŪR</span>
          </div>
        </>
      ) : theme === "care" ? (
        <>
          <div className="phone phone-back">
            <div className="phone-notch" />
            <span className="care-logo">+</span>
            <strong>{ar ? "وقت لك." : "Time for you."}</strong>
            <div className="care-ring" />
            <span className="phone-foot">
              {ar ? "بداية أبسط، لرعاية أقرب" : "A simpler way to feel better."}
            </span>
          </div>
          <div className="phone phone-front">
            <div className="phone-notch" />
            <div className="phone-top">
              <span>+</span>
              <b>09:41</b>
            </div>
            <small>{ar ? "صباح الخير" : "GOOD MORNING"}</small>
            <strong>
              {ar ? "كيف نساعدك\nاليوم؟" : "How can we\nhelp today?"}
            </strong>
            <div className="care-pills">
              <i />
              <i />
              <i />
            </div>
            <div className="care-appointment">
              <span>{ar ? "موعدك القادم" : "YOUR NEXT VISIT"}</span>
              <b>{ar ? "الأحد، ١٠:٣٠" : "Sunday, 10:30"}</b>
              <div>
                <i /> {ar ? "استشارة عامة" : "General consultation"}
              </div>
            </div>
            <div className="phone-tabs">
              <span>⌂</span>
              <span>▦</span>
              <span>○</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="dashboard-window">
            <div className="dash-nav">
              <b>∷ MIZAN</b>
              <span>○</span>
            </div>
            <div className="dash-body">
              <aside>
                <i />
                <i />
                <i />
                <i />
              </aside>
              <div className="dash-main">
                <small>
                  {ar ? "صورة أوضح للأعمال" : "A CLEARER BUSINESS PICTURE"}
                </small>
                <strong>
                  {ar ? "كل التفاصيل. أمامك." : "Everything. In view."}
                </strong>
                <div className="dash-metrics">
                  <div>
                    <span>{ar ? "ملخص توضيحي" : "ILLUSTRATIVE DATA"}</span>
                    <b>24,800</b>
                  </div>
                  <div>
                    <span>{ar ? "مؤشر الأداء" : "PERFORMANCE INDEX"}</span>
                    <b>
                      84.6<span>%</span>
                    </b>
                  </div>
                </div>
                <div className="dash-chart">
                  <div className="chart-grid" />
                  {[20, 35, 27, 49, 43, 65, 57, 78, 70, 88, 75, 96].map(
                    (n, i) => (
                      <i key={i} style={{ height: `${n}%` }} />
                    ),
                  )}
                </div>
                <div className="chart-key">
                  <i />
                  {ar ? "بيانات تجريبية" : "Sample data"}
                </div>
              </div>
            </div>
          </div>
          <span className="dash-disc" />
        </>
      )}
    </div>
  );
}
