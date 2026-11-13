import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { StaticRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { createI18n } from "./i18n";
import App from "./App";
export { getMeta, renderHead, publicPaths } from "./utils/seo";
export function render(url) {
  return new Promise((resolve, reject) => {
    const lang = url.startsWith("/en") ? "en" : "ar";
    let html = "";
    const output = new PassThrough();
    output.on("data", (chunk) => {
      html += chunk.toString();
    });
    output.on("end", () => resolve(html));
    output.on("error", reject);
    const { pipe } = renderToPipeableStream(
      <I18nextProvider i18n={createI18n(lang)}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </I18nextProvider>,
      {
        onAllReady() {
          pipe(output);
        },
        onError: reject,
      },
    );
  });
}
