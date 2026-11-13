import { randomUUID } from "node:crypto";

const MAX_BODY_BYTES = 16_384;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map();
const PROJECT_TYPES = new Set([
  "web-development",
  "mobile-apps",
  "ui-ux",
  "branding",
  "digital-marketing",
  "data-ai",
  "other",
]);

function respond(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(payload);
}

function fail(res, status, code, fields) {
  return respond(res, status, {
    ok: false,
    error: { code, ...(fields ? { fields } : {}) },
  });
}

function configuredOrigin(req) {
  try {
    if (process.env.SITE_URL) return new URL(process.env.SITE_URL).origin;
    const host = req.headers.host;
    if (typeof host !== "string" || !/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host))
      return null;
    const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
    return `${local ? "http" : "https"}://${host}`;
  } catch {
    return null;
  }
}

async function readBody(req) {
  const declaredLength = Number(req.headers["content-length"] || 0);
  if (!Number.isFinite(declaredLength) || declaredLength > MAX_BODY_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  let raw = req.body;
  if (raw === undefined) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      const bytes = Buffer.from(chunk);
      size += bytes.length;
      if (size > MAX_BODY_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
      chunks.push(bytes);
    }
    raw = Buffer.concat(chunks).toString("utf8");
  }
  if (Buffer.isBuffer(raw)) raw = raw.toString("utf8");
  const serialized = typeof raw === "string" ? raw : JSON.stringify(raw);
  if (!serialized || Buffer.byteLength(serialized, "utf8") > MAX_BODY_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new Error("INVALID_JSON");
  return data;
}

function validate(data) {
  const cleaned = {};
  const invalid = [];
  for (const key of ["name", "email", "projectType", "message"]) {
    cleaned[key] = typeof data[key] === "string" ? data[key].trim() : "";
  }
  cleaned.lang = data.lang === undefined ? "ar" : data.lang;
  if (
    cleaned.name.length < 2 ||
    cleaned.name.length > 100 ||
    /[\r\n\0]/.test(cleaned.name)
  )
    invalid.push("name");
  if (
    cleaned.email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(cleaned.email)
  )
    invalid.push("email");
  if (!PROJECT_TYPES.has(cleaned.projectType)) invalid.push("projectType");
  if (
    cleaned.message.length < 20 ||
    cleaned.message.length > 5000 ||
    cleaned.message.includes("\0")
  )
    invalid.push("message");
  if (!["ar", "en"].includes(cleaned.lang)) invalid.push("lang");
  if (
    data.website !== undefined &&
    (typeof data.website !== "string" || data.website.trim())
  )
    invalid.push("website");
  return { cleaned, invalid };
}

function limited(req) {
  const now = Date.now();
  // Best effort per warm function instance. Use a shared rate-limit store or a
  // platform firewall rule before attracting large public traffic. Do not trust
  // client-supplied forwarding headers as an identity source.
  if (attempts.size > 10_000) {
    for (const [key, value] of attempts)
      if (value.until <= now) attempts.delete(key);
    if (attempts.size > 10_000) return true;
  }
  const address = req.socket?.remoteAddress || "unidentified";
  const bucket = attempts.get(address);
  if (!bucket || bucket.until <= now) {
    attempts.set(address, { count: 1, until: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_ATTEMPTS;
}

export default async function contact(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, 405, "METHOD_NOT_ALLOWED");
  }
  const allowedOrigin = configuredOrigin(req);
  if (!allowedOrigin || req.headers.origin !== allowedOrigin)
    return fail(res, 403, "ORIGIN_NOT_ALLOWED");
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || ""))
    return fail(res, 415, "JSON_REQUIRED");

  let data;
  try {
    data = await readBody(req);
  } catch (error) {
    return fail(
      res,
      error.message === "PAYLOAD_TOO_LARGE" ? 413 : 400,
      error.message === "PAYLOAD_TOO_LARGE"
        ? "PAYLOAD_TOO_LARGE"
        : "INVALID_JSON",
    );
  }
  const { cleaned, invalid } = validate(data);
  if (invalid.length) return fail(res, 400, "VALIDATION_ERROR", invalid);

  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.CONTACT_FROM_EMAIL;
  const recipient = process.env.CONTACT_TO_EMAIL || "info@jreaslab.com";
  if (!apiKey || !sender) return fail(res, 503, "MAIL_NOT_CONFIGURED");
  if (limited(req)) {
    res.setHeader("Retry-After", "900");
    return fail(res, 429, "RATE_LIMITED");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": randomUUID(),
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: cleaned.email,
        subject: `Jreas Lab · ${cleaned.projectType} · ${cleaned.name}`,
        text: [
          "New website project enquiry",
          `Name: ${cleaned.name}`,
          `Email: ${cleaned.email}`,
          `Project type: ${cleaned.projectType}`,
          `Language: ${cleaned.lang}`,
          "",
          cleaned.message,
        ].join("\n"),
      }),
    });
    const receipt = await result.json().catch(() => null);
    if (!result.ok || !receipt?.id)
      return fail(res, 502, "MAIL_PROVIDER_ERROR");
    // This confirms provider acceptance only; inbox delivery is not asserted.
    return respond(res, 202, { ok: true, status: "accepted" });
  } catch (error) {
    return fail(
      res,
      error.name === "AbortError" ? 504 : 502,
      error.name === "AbortError" ? "MAIL_TIMEOUT" : "MAIL_PROVIDER_ERROR",
    );
  } finally {
    clearTimeout(timeout);
  }
}
