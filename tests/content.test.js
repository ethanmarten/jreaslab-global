import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resources } from '../src/i18n/resources.js';
import { services } from '../src/data/services.js';
import { projects } from '../src/data/projects.js';

// Vite resolves extensionless imports in application source. Rewrite only the
// import URLs in memory so Node can exercise the same SEO implementation.
let seoSource = await readFile(new URL('../src/utils/seo.js', import.meta.url), 'utf8');
for (const [specifier, file] of [
  ['../i18n/resources', '../src/i18n/resources.js'],
  ['../data/services', '../src/data/services.js'],
  ['../data/projects', '../src/data/projects.js'],
]) seoSource = seoSource.replace(`'${specifier}'`, JSON.stringify(new URL(file, import.meta.url).href));
const { publicPaths, getMeta, renderHead } = await import(`data:text/javascript;base64,${Buffer.from(seoSource).toString('base64')}`);

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  return typeof value;
}

function strings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

test('Arabic and English resources have matching keys and array structures', () => {
  assert.deepEqual(shape(resources.ar), shape(resources.en));
  for (const locale of ['ar', 'en']) for (const text of strings(resources[locale])) assert.ok(text.trim().length, 'No empty translation values');
  for (const text of strings(resources.en)) assert.ok(!/[\u0600-\u06ff]/u.test(text), `Untranslated Arabic in English resource: ${text}`);
});

test('all six required services have complete bilingual detail content', () => {
  assert.deepEqual(services.map(service => service.slug).sort(), ['web-development', 'mobile-apps', 'ui-ux', 'branding', 'digital-marketing', 'data-ai'].sort());
  assert.equal(new Set(services.map(service => service.slug)).size, 6);
  for (const service of services) {
    assert.match(service.slug, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(service.icon);
    assert.deepEqual(shape(service.ar), shape(service.en));
    for (const locale of ['ar', 'en']) {
      for (const key of ['title', 'short', 'intro']) assert.ok(service[locale][key]?.trim().length > 5, `${service.slug}.${locale}.${key}`);
      for (const key of ['subservices', 'deliverables', 'steps']) {
        assert.ok(service[locale][key]?.length >= 3, `${service.slug}.${locale}.${key}`);
        assert.ok(service[locale][key].every(item => typeof item === 'string' && item.trim().length > 5));
      }
    }
    for (const text of strings(service.en)) assert.ok(!/[\u0600-\u06ff]/u.test(text));
  }
});

test('portfolio concepts explicitly disclose their illustrative status in both languages', () => {
  assert.ok(projects.length >= 3);
  assert.equal(new Set(projects.map(project => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.deepEqual(shape(project.ar), shape(project.en));
    assert.ok(['web', 'product', 'brand'].includes(project.category));
    assert.ok(['commerce', 'care', 'insight'].includes(project.theme));
    assert.match(project.ar.label, /تصوري/);
    assert.match(project.en.label, /concept/i);
    assert.match(project.ar.note, /ليست|ليس/);
    assert.match(project.en.note, /not /i);
    for (const locale of ['ar', 'en']) {
      for (const key of ['title', 'category', 'label', 'summary', 'challenge', 'approach', 'note']) assert.ok(project[locale][key]?.trim().length > 4, `${project.slug}.${locale}.${key}`);
      assert.ok(project[locale].deliverables.length >= 3);
    }
  }
});

test('copy does not introduce fabricated client counts, awards, ratings or offices', () => {
  const text = strings({ resources, services, projects }).join('\n');
  assert.doesNotMatch(text, /(?:trusted by\s+\d|\d[\d,+]*\s+(?:happy clients|clients served|years of experience)|award-winning studio|rated\s+5|مئات العملاء|آلاف العملاء|\d+\s+(?:عميل راض|سنوات خبرة)|مكاتبنا حول العالم|فروعنا حول العالم)/i);
});

test('all 28 public routes are unique and have bilingual counterparts', () => {
  const routes = publicPaths();
  assert.equal(routes.length, 28);
  assert.equal(new Set(routes).size, routes.length);
  for (const route of routes) {
    assert.match(route, /^\/(ar|en)(\/|$)/);
    assert.ok(routes.includes(route.replace(/^\/(ar|en)/, route.startsWith('/ar') ? '/en' : '/ar')));
  }
});

test('every public route has valid localized metadata, canonical and alternates', () => {
  for (const route of publicPaths()) {
    const meta = getMeta(route);
    const lang = route.startsWith('/en') ? 'en' : 'ar';
    assert.equal(meta.valid, true, route);
    assert.equal(meta.lang, lang);
    assert.equal(meta.dir, lang === 'ar' ? 'rtl' : 'ltr');
    assert.ok(meta.title.length > 10);
    assert.ok(meta.description.length > 30);
    assert.equal(new URL(meta.url).pathname, route);
    assert.equal(new URL(meta.ar).pathname, route.replace(/^\/(ar|en)/, '/ar'));
    assert.equal(new URL(meta.en).pathname, route.replace(/^\/(ar|en)/, '/en'));
    if (lang === 'en') assert.doesNotMatch(`${meta.title} ${meta.description}`, /[\u0600-\u06ff]/u);
    const head = renderHead(meta);
    assert.ok(head.includes('name="description"'));
    assert.ok(head.includes(`rel="canonical" href="${meta.url}"`));
    assert.ok(head.includes('hreflang="x-default"'));
    assert.ok(head.includes('property="og:image"'));
    assert.ok(head.includes('name="robots" content="index,follow"'));
  }
});

test('unknown routes receive localized noindex metadata', () => {
  for (const path of ['/ar/unknown', '/en/services/unknown', '/ar/work/unknown']) {
    const meta = getMeta(path);
    assert.equal(meta.valid, false);
    assert.equal(meta.title, '404 | Jreas Lab');
    assert.ok(renderHead(meta).includes('noindex,follow'));
  }
});

test('organization structured data contains no invented reviews, locations or metrics', () => {
  const head = renderHead(getMeta('/ar'));
  const json = head.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  assert.ok(json);
  const schema = JSON.parse(json);
  assert.equal(schema['@type'], 'Organization');
  assert.equal(schema.name, 'Jreas Lab');
  assert.equal(schema.email, 'info@jreaslab.com');
  for (const field of ['aggregateRating', 'review', 'numberOfEmployees', 'foundingDate', 'address']) assert.equal(schema[field], undefined);
});
