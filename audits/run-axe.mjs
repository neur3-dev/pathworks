// Run axe-core against a list of URLs via Playwright's bundled Chromium.
// Outputs a single JSON report per-URL: counts, violations, incomplete.
//
// Setup (one-time, outside this repo so we don't bloat the lockfile):
//   mkdir -p /tmp/axe-runner && cd /tmp/axe-runner
//   npm init -y
//   npm install playwright @axe-core/playwright
//   npx playwright install chromium     # downloads Chromium to ~/.cache/ms-playwright
//
// Run from a fresh dashboard preview or the Docker full stack. Set
// PATHWORKS_AXE_BASE_URL when not using :4173.
//   cd /tmp/axe-runner
//   node /path/to/repo/audits/run-axe.mjs /path/to/repo/audits/axe-YYYY-MM-DD.json
//
// System deps for Chromium on Ubuntu/Debian (one-time, requires sudo):
//   sudo apt install -y libasound2t64 libnss3 libgbm1 libxshmfence1 libxkbcommon0

import { createRequire } from 'node:module';
import fs from 'node:fs/promises';

const axeRequire = createRequire(`${process.env.PATHWORKS_AXE_NODE_MODULES || '/tmp/pathworks-axe/node_modules'}/`);
const { chromium } = axeRequire('playwright');
const AxeBuilderModule = axeRequire('@axe-core/playwright');
const AxeBuilder = AxeBuilderModule.default ?? AxeBuilderModule;

const DEFAULT_PATHS = ['/', '/login', '/signin', '/counselor', '/onboarding'];
const fixturePath = process.env.PATHWORKS_AXE_FIXTURE_FILE;
const fixture = fixturePath ? JSON.parse(await fs.readFile(fixturePath, 'utf8')) : {};
const BASE_URL = (process.env.PATHWORKS_AXE_BASE_URL || fixture.baseUrl || 'http://127.0.0.1:4173').replace(/\/$/, '');
const pathSource = process.env.PATHWORKS_AXE_URLS || fixture.urls?.join(',') || DEFAULT_PATHS.join(',');
const URLS = pathSource
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean)
  .map((url) =>
    url.startsWith('http://') || url.startsWith('https://') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
  );

const outPath = process.argv[2] || '/tmp/axe-result.json';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const results = [];

if (fixture.participantLoginUrl) {
  const loginPage = await ctx.newPage();
  await loginPage
    .goto(fixture.participantLoginUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
    .catch((error) => {
      results.push({ url: fixture.participantLoginUrl, login_error: error.message });
    });
  await loginPage.close();
}

for (const url of URLS) {
  const page = await ctx.newPage();
  let resp = null;
  let err = null;
  try {
    resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    err = e.message;
  }
  if (err) {
    results.push({ url, error: err });
    await page.close();
    continue;
  }
  const axe = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']);
  let report;
  try {
    report = await axe.analyze();
  } catch (e) {
    results.push({ url, http_status: resp?.status() ?? null, axe_error: e.message });
    await page.close();
    continue;
  }
  results.push({
    url,
    http_status: resp?.status() ?? null,
    final_url: resp?.url() ?? url,
    counts: {
      violations: report.violations.length,
      incomplete: report.incomplete.length,
      passes: report.passes.length,
      inapplicable: report.inapplicable.length
    },
    violations: report.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      target_sample: v.nodes.slice(0, 3).map((n) => n.target),
      failure_sample: v.nodes.slice(0, 1).map((n) => (n.failureSummary || '').slice(0, 400))
    })),
    incomplete: report.incomplete.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length
    }))
  });
  await page.close();
}

await browser.close();
await fs.writeFile(
  outPath,
  JSON.stringify(
    {
      tool: '@axe-core/playwright via playwright/chromium',
      date: new Date().toISOString().slice(0, 10),
      generated_by: 'audits/run-axe.mjs',
      results
    },
    null,
    2
  )
);

const total = results.reduce((acc, r) => acc + (r.counts?.violations || 0), 0);
const errored = results.filter((r) => r.error || r.login_error || r.axe_error);
console.log(`audited ${results.length} URLs - total violations: ${total} - wrote ${outPath}`);

if (total > 0 || errored.length > 0) {
  process.exitCode = 1;
}
