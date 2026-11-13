import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import contact from "../api/contact.js";

const originalFetch = globalThis.fetch;
const originalEnv = Object.fromEntries(
  ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL", "SITE_URL"].map(
    (key) => [key, process.env[key]],
  ),
);
let address = 1;

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function setup(overrides = {}) {
  process.env.SITE_URL = "https://example.test";
  process.env.RESEND_API_KEY = "test-only-key";
  process.env.CONTACT_FROM_EMAIL = "Website <website@example.test>";
  process.env.CONTACT_TO_EMAIL = "info@jreaslab.com";
  const req = {
    method: "POST",
    headers: {
      origin: "https://example.test",
      host: "example.test",
      "content-type": "application/json",
    },
    socket: { remoteAddress: `test-${address++}` },
    body: {
      name: "Test Person",
      email: "person@example.test",
      projectType: "web-development",
      message: "A website for a small retail business.",
      lang: "en",
      website: "",
    },
    ...overrides,
  };
  const res = {
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
  return { req, res };
}

test("rejects unsupported methods", async () => {
  const { req, res } = setup({ method: "GET" });
  await contact(req, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "POST");
});

test("requires the configured origin and ignores forwarded hosts", async () => {
  const { req, res } = setup();
  req.headers.origin = "https://untrusted.test";
  req.headers["x-forwarded-host"] = "untrusted.test";
  await contact(req, res);
  assert.equal(res.statusCode, 403);
});

test("requires JSON requests", async () => {
  const { req, res } = setup();
  req.headers["content-type"] = "text/plain";
  await contact(req, res);
  assert.equal(res.statusCode, 415);
});

test("rejects oversized and malformed bodies", async () => {
  for (const [body, expected] of [
    ["x".repeat(17000), 413],
    ["{invalid", 400],
    [null, 400],
  ]) {
    const { req, res } = setup({ body });
    await contact(req, res);
    assert.equal(res.statusCode, expected);
  }
});

test("validates required fields, lengths, service, language and honeypot", async () => {
  const { req, res } = setup();
  req.body = {
    name: "\n",
    email: "invalid",
    projectType: "invented",
    message: "short",
    lang: "xx",
    website: "spam",
  };
  await contact(req, res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body.error.fields, [
    "name",
    "email",
    "projectType",
    "message",
    "lang",
    "website",
  ]);
});

test("returns a real unavailable state when mail is not configured", async () => {
  const { req, res } = setup();
  delete process.env.RESEND_API_KEY;
  globalThis.fetch = () => {
    throw new Error("Must not send");
  };
  await contact(req, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.error.code, "MAIL_NOT_CONFIGURED");
});

test("only confirms provider acceptance and fixes the destination on the server", async () => {
  const { req, res } = setup();
  req.body.to = "attacker@example.test";
  let outgoing;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    outgoing = JSON.parse(options.body);
    return { ok: true, json: async () => ({ id: "mock-mail-id" }) };
  };
  await contact(req, res);
  assert.equal(res.statusCode, 202);
  assert.deepEqual(res.body, { ok: true, status: "accepted" });
  assert.deepEqual(outgoing.to, ["info@jreaslab.com"]);
  assert.equal(outgoing.reply_to, "person@example.test");
  assert.ok(outgoing.text.includes(req.body.message));
  assert.equal(outgoing.html, undefined);
});

test("provider failures and invalid receipts never report success", async () => {
  for (const result of [
    { ok: false, json: async () => ({ message: "provider error" }) },
    { ok: true, json: async () => ({}) },
  ]) {
    const { req, res } = setup();
    globalThis.fetch = async () => result;
    await contact(req, res);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.ok, false);
  }
});

test("handles network timeout without leaking provider details", async () => {
  const { req, res } = setup();
  globalThis.fetch = async () => {
    throw Object.assign(new Error("private detail"), { name: "AbortError" });
  };
  await contact(req, res);
  assert.equal(res.statusCode, 504);
  assert.equal(res.body.error.code, "MAIL_TIMEOUT");
  assert.ok(!JSON.stringify(res.body).includes("private detail"));
});

test("limits repeated submissions within a warm instance", async () => {
  const { req } = setup();
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ id: "mock-mail-id" }),
  });
  for (let i = 0; i < 6; i++) {
    const { res } = setup();
    await contact(req, res);
    assert.equal(res.statusCode, i < 5 ? 202 : 429);
  }
});
