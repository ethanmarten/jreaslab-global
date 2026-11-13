import { useRef, useState } from "react";
export default function ReviewPage() {
  const [width, setWidth] = useState(390);
  const [lang, setLang] = useState("ar");
  const [page, setPage] = useState("");
  const [report, setReport] = useState(null);
  const frame = useRef();
  async function audit() {
    setReport({ running: true });
    try {
      const { default: source } = await import("axe-core/axe.min.js?raw");
      const doc = frame.current.contentDocument;
      const script = doc.createElement("script");
      script.textContent = source;
      doc.head.appendChild(script);
      const results = await frame.current.contentWindow.axe.run(doc, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      });
      setReport({
        viewport: doc.defaultView.innerWidth,
        scrollWidth: doc.documentElement.scrollWidth,
        violations: results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        passes: results.passes.length,
        overflowing: [...doc.querySelectorAll("main *")]
          .filter((el) => {
            const b = el.getBoundingClientRect();
            return (
              b.width > 0 &&
              (b.right > doc.documentElement.clientWidth + 1 || b.left < -1) &&
              getComputedStyle(el).position !== "absolute"
            );
          })
          .slice(0, 15)
          .map((el) => ({
            tag: el.tagName,
            cls: el.className,
            text: el.textContent.slice(0, 70),
          })),
      });
    } catch (error) {
      setReport({ error: error.message });
    }
  }
  const height =
    width === 1920 ? 1080 : width === 1366 ? 768 : width === 768 ? 1024 : 844;
  const scale = Math.min(1, 1200 / width);
  return (
    <div
      style={{
        direction: "ltr",
        fontFamily: "system-ui",
        padding: 24,
        background: "#e1e6e0",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: 20 }}>Jreas Lab — responsive review</h1>
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <label>
          Viewport{" "}
          <select
            value={width}
            onChange={(e) => {
              setWidth(Number(e.target.value));
              setReport(null);
            }}
          >
            {[360, 390, 768, 1366, 1920].map((w) => (
              <option key={w} value={w}>
                {w}px
              </option>
            ))}
          </select>
        </label>
        <label>
          Language{" "}
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              setReport(null);
            }}
          >
            <option value="ar">Arabic</option>
            <option value="en">English</option>
          </select>
        </label>
        <label>
          Page{" "}
          <select
            value={page}
            onChange={(e) => {
              setPage(e.target.value);
              setReport(null);
            }}
          >
            <option value="">Home</option>
            <option value="/services">Services</option>
            <option value="/services/data-ai">Service details</option>
            <option value="/work">Work</option>
            <option value="/work/care-booking">Concept details</option>
            <option value="/about">About</option>
            <option value="/contact">Contact</option>
          </select>
        </label>
        <button type="button" onClick={audit}>
          Check accessibility
        </button>
      </div>
      <div
        style={{
          width: width * scale,
          height: height * scale,
          marginInline: "auto",
          boxShadow: "0 15px 60px #102d2c22",
        }}
      >
        <iframe
          ref={frame}
          title="Responsive site preview"
          key={`${width}-${lang}-${page}`}
          src={`/${lang}${page}`}
          width={width}
          height={height}
          style={{
            display: "block",
            border: 0,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
      {report && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: 12,
            maxWidth: 1200,
            margin: "30px auto",
            background: "#fff",
            padding: 20,
          }}
        >
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
    </div>
  );
}
