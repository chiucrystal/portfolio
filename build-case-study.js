#!/usr/bin/env node
// build-case-study.js
// Usage: node build-case-study.js work/<slug>.json
// Generates work/<slug>.html from JSON data.

const fs   = require('fs');
const path = require('path');

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error('Usage: node build-case-study.js work/<slug>.json');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const dir  = path.dirname(jsonPath);
const out  = path.join(dir, `${data.meta.slug}.html`);

// ── Helpers ────────────────────────────────────────────────────────────────
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Converts a plain-text multi-line string (with optional leading "- " list items)
// into a mix of <p> and <ul> blocks.
function textToHtml(raw) {
  if (!raw) return '';
  const lines  = raw.split('\n');
  const chunks = [];
  let listBuf  = [];

  function flushList() {
    if (!listBuf.length) return;
    chunks.push(`<ul>${listBuf.map(l => `<li class="t-default">${esc(l)}</li>`).join('')}</ul>`);
    listBuf = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      listBuf.push(trimmed.slice(2));
    } else {
      flushList();
      if (trimmed) chunks.push(`<p>${esc(trimmed)}</p>`);
    }
  }
  flushList();
  return chunks.join('\n          ');
}

// ── Section renderers ──────────────────────────────────────────────────────

function renderHero({ imagePath, imageAlt }) {
  return `
    <section class="hero">
      <img src="${esc(imagePath)}" alt="${esc(imageAlt)}">
    </section>`;
}

function renderTitleBlock(meta) {
  const metaText = `${esc(meta.company)} (${esc(meta.year)}) · Team: ${esc(meta.team)}`;
  const jumpLink = meta.jumpToSolutionAnchor
    ? `<a href="${esc(meta.jumpToSolutionAnchor)}" class="t-link">Jump to solution</a>`
    : '';
  return `
      <div class="title-block">
        <h1 class="t-display">${esc(meta.title)}</h1>
        <div class="meta-row">
          <span class="t-label">${metaText}</span>
          ${jumpLink}
        </div>
      </div>`;
}

function renderChallengeTldr(dc, tldr) {
  return `
      <div class="challenge-tldr">
        <div class="challenge-col">
          <span class="t-label">The design challenge</span>
          <h2>${esc(dc.intro)}<em>${esc(dc.emphasis)}</em>${esc(dc.outro)}</h2>
        </div>
        <div class="tldr-col">
          <span class="t-label">The tldr;</span>
          <div class="tldr-item">
            <p class="tldr-label">Problem:</p>
            <p>${esc(tldr.problem)}</p>
          </div>
          <div class="tldr-item">
            <p class="tldr-label">What I did:</p>
            <p>${esc(tldr.whatIDid)}</p>
          </div>
          <div class="tldr-item">
            <p class="tldr-label">What changed:</p>
            <p>${esc(tldr.whatChanged)}</p>
          </div>
        </div>
      </div>`;
}

function renderBusinessContext({ bullets }) {
  const items = bullets.map(b => `<li class="t-default">${esc(b)}</li>`).join('\n          ');
  return `
      <div class="business-context">
        <div class="business-context-label">
          <span class="t-label">Business context</span>
        </div>
        <ul class="business-context-bullets">
          ${items}
        </ul>
      </div>`;
}

function renderDiscovery(d) {
  const leftHtml = textToHtml(d.leftColumn);
  const synthH3  = d.synthStatement
    ? `<h3 class="discovery-synth">${esc(d.synthStatement)}</h3>` : '';
  const quoteDiv = d.inlineQuote
    ? `<div class="quote-block discovery-quote">${esc(d.inlineQuote)}</div>` : '';

  // interleave discoveryImages with bullets if present
  let rightHtml = synthH3 + quoteDiv;
  if (d.discoveryImages && d.discoveryImages.length) {
    for (const img of d.discoveryImages) {
      rightHtml += `\n          <img class="discovery-img" src="${esc(img.imagePath)}" alt="${img.caption ? esc(img.caption) : ''}">`;
    }
  }
  if (d.bullets && d.bullets.length) {
    const items = d.bullets.map(b => `<li class="t-default">${esc(b)}</li>`).join('\n            ');
    rightHtml += `\n          <ul class="discovery-bullets">\n            ${items}\n          </ul>`;
  }

  return `
      <div class="discovery">
        <div class="discovery-left">
          <span class="t-label">Discovery and Research</span>
          ${leftHtml}
        </div>
        <div class="discovery-right">
          ${rightHtml}
        </div>
      </div>`;
}

function renderTesting(t) {
  const leftHtml = textToHtml(t.leftColumn);
  const findings = (t.findings || []).map(f => {
    if (f.type === 'quote') return `<div class="quote-block">${esc(f.text)}</div>`;
    return `<h3>${esc(f.text)}</h3>`;
  }).join('\n          ');

  return `
      <div class="testing">
        <div class="testing-left">
          <span class="t-label">What Testing Revealed</span>
          ${leftHtml}
        </div>
        <div class="testing-right">
          ${findings}
        </div>
      </div>`;
}

function renderSolution(s) {
  const cards = (s.cards || []).map(c => {
    const body    = c.body    ? `<p>${esc(c.body)}</p>` : '';
    const caption = c.caption ? `<span class="caption">${esc(c.caption)}</span>` : '';
    return `
          <div class="solution-card">
            <h3>${esc(c.h3)}</h3>
            ${body}
            <img src="${esc(c.imagePath)}" alt="${esc(c.h3)}">
            ${caption}
          </div>`;
  }).join('');

  const anchor = data.meta.jumpToSolutionAnchor
    ? ` id="${data.meta.jumpToSolutionAnchor.replace('#', '')}"` : ' id="solution"';

  return `
      <div${anchor} class="solution">
        <div class="solution-left">
          <span class="t-label">Solution</span>
        </div>
        <div class="solution-cards">${cards}
        </div>
      </div>`;
}

function renderResults({ bullets }) {
  const items = bullets.map(b => `<li class="t-default">${esc(b)}</li>`).join('\n          ');
  return `
      <div class="results">
        <div class="results-left">
          <span class="t-label">Results &amp; Impact</span>
        </div>
        <ul class="results-bullets">
          ${items}
        </ul>
      </div>`;
}

// ── New fields: screens + closingNote ──────────────────────────────────────

function renderScreens(screens) {
  const figures = screens.map(s => `
          <figure class="screen-figure">
            <img src="${esc(s.imagePath)}" alt="${esc(s.imageAlt)}">
          </figure>`).join('');
  return `
      <div class="screens">
        <div class="screens-label">
          <span class="t-label">Screens</span>
        </div>
        <div class="screens-gallery">${figures}
        </div>
      </div>`;
}

function renderClosingNote(note) {
  return `
      <p class="closing-note">${esc(note)}</p>`;
}

// ── Assemble body sections ─────────────────────────────────────────────────

const sections = [];
sections.push(renderHero(data.hero));
sections.push(renderTitleBlock(data.meta));

// Always-present structural sections
sections.push(renderChallengeTldr(data.designChallenge, data.tldr));
sections.push(renderBusinessContext(data.businessContext));

// Optional research sections
if (data.discovery)       sections.push(renderDiscovery(data.discovery));
if (data.testing)         sections.push(renderTesting(data.testing));
if (data.solution)        sections.push(renderSolution(data.solution));
if (data.results)         sections.push(renderResults(data.results));

// New optional fields
if (data.screens)         sections.push(renderScreens(data.screens));
if (data.closingNote)     sections.push(renderClosingNote(data.closingNote));

const [heroSection, ...containerSections] = sections;

// ── Full page ──────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(data.meta.title)} — crystal.chiu</title>
  <link rel="stylesheet" href="../tokens.css?v=3">
  <style>
    /* ─── Container ──────────────────────────────────────────── */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
    }

    /* ─── Hero ────────────────────────────────────────────────── */
    .hero {
      margin-top: 57px;
    }

    .hero img {
      display: block;
      width: 100%;
      max-height: 480px;
      object-fit: cover;
      object-position: top;
    }

    /* ─── Title block ─────────────────────────────────────────── */
    .title-block {
      padding-top: 48px;
    }

    .title-block h1 {
      margin-bottom: 12px;
    }

    .meta-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    /* ─── Challenge + TL;DR ──────────────────────────────────── */
    .challenge-tldr {
      display: flex;
      gap: 4%;
      padding-top: 64px;
    }

    .challenge-col {
      flex: 0 0 38%;
      border: 2px solid var(--color-link);
      padding: 24px;
      background-color: #FFFEFB;
      box-shadow: 8px 8px 0 #FBD916;
    }

    .challenge-col .t-label {
      display: block;
      margin-bottom: 16px;
    }

    .challenge-col h2 em {
      font-style: italic;
      text-decoration: underline;
    }

    .tldr-col {
      flex: 0 0 58%;
    }

    .tldr-col .t-label {
      display: block;
      margin-bottom: 16px;
    }

    .tldr-item {
      margin-bottom: 16px;
    }

    .tldr-item:last-child {
      margin-bottom: 0;
    }

    .tldr-label {
      font-weight: 500;
    }

    /* ─── Business context ────────────────────────────────────── */
    .business-context {
      display: flex;
      gap: 4%;
      padding-top: 80px;
    }

    .business-context-label {
      flex: 0 0 38%;
    }

    .business-context-bullets {
      flex: 0 0 58%;
      padding-left: 20px;
    }

    .business-context-bullets li {
      margin-bottom: 8px;
    }

    .business-context-bullets li:last-child {
      margin-bottom: 0;
    }

    /* ─── Discovery ──────────────────────────────────────────── */
    .discovery {
      display: flex;
      gap: 4%;
      padding-top: 64px;
    }

    .discovery-left {
      flex: 0 0 38%;
    }

    .discovery-left .t-label {
      display: block;
      margin-bottom: 16px;
    }

    .discovery-left p {
      margin-bottom: 12px;
    }

    .discovery-left ul {
      padding-left: 20px;
    }

    .discovery-left ul li {
      margin-bottom: 4px;
    }

    .discovery-right {
      flex: 0 0 58%;
    }

    .discovery-synth {
      margin-bottom: 16px;
    }

    .discovery-quote {
      margin-bottom: 16px;
    }

    .discovery-img {
      display: block;
      width: 100%;
      margin-bottom: 24px;
    }

    .discovery-bullets {
      padding-left: 20px;
      margin-bottom: 16px;
    }

    .discovery-bullets li {
      margin-bottom: 8px;
    }

    .discovery-bullets li:last-child {
      margin-bottom: 0;
    }

    /* ─── Testing ────────────────────────────────────────────── */
    .testing {
      display: flex;
      gap: 4%;
      padding-top: 64px;
    }

    .testing-left {
      flex: 0 0 38%;
    }

    .testing-left .t-label {
      display: block;
      margin-bottom: 16px;
    }

    .testing-left p {
      margin-bottom: 12px;
    }

    .testing-left ul {
      padding-left: 20px;
    }

    .testing-left ul li {
      margin-bottom: 4px;
    }

    .testing-right {
      flex: 0 0 58%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ─── Solution ───────────────────────────────────────────── */
    .solution {
      display: flex;
      gap: 4%;
      padding-top: 64px;
    }

    .solution-left {
      flex: 0 0 38%;
    }

    .solution-left .t-label {
      display: block;
    }

    .solution-cards {
      flex: 0 0 58%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .solution-card {
      border: 2px solid #62B61B;
      padding: 24px;
      box-shadow: 5px 5px 0 0 #62B61B;
    }

    .solution-card h3 {
      margin-bottom: 8px;
    }

    .solution-card p {
      margin-bottom: 16px;
    }

    .solution-card img {
      display: block;
      width: 100%;
    }

    .solution-card .caption {
      display: block;
      margin-top: 8px;
    }

    /* ─── Results ────────────────────────────────────────────── */
    .results {
      display: flex;
      gap: 4%;
      padding-top: 64px;
    }

    .results-left {
      flex: 0 0 38%;
    }

    .results-left .t-label {
      display: block;
    }

    .results-bullets {
      flex: 0 0 58%;
      padding-left: 20px;
    }

    .results-bullets li {
      margin-bottom: 8px;
    }

    .results-bullets li:last-child {
      margin-bottom: 0;
    }

    /* ─── Screens ────────────────────────────────────────────── */
    .screens {
      display: flex;
      gap: 4%;
      padding-top: 64px;
    }

    .screens-label {
      flex: 0 0 38%;
    }

    .screens-gallery {
      flex: 0 0 58%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .screen-figure {
      margin: 0;
    }

    .screen-figure img {
      display: block;
      width: 100%;
      border: 1px solid var(--color-border, #e0ddd6);
    }

    /* ─── Closing note ───────────────────────────────────────── */
    .closing-note {
      padding-top: 48px;
      padding-bottom: 80px;
      font-style: italic;
      text-align: center;
    }

    /* ─── Footer ─────────────────────────────────────────────── */
    .site-footer {
      padding: 80px 0;
    }

    .footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      text-align: center;
    }

    .footer-nav {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .footer-nav a {
      color: var(--color-heading);
    }

    .footer-nav a:hover {
      color: var(--color-muted);
    }

    .footer-avatar {
      display: block;
      max-width: 80px;
    }

    .footer-quote {
      color: var(--color-muted);
      max-width: 600px;
    }

    .footer-socials {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .footer-socials a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--color-body);
      transition: opacity 0.15s ease;
    }

    .footer-socials a:hover {
      opacity: 0.45;
    }

    .footer-socials img {
      display: block;
      width: 24px;
      height: 24px;
    }
  </style>
</head>
<body>

  <main>
${heroSection}

    <div class="container">
${containerSections.join('\n')}

    </div>

  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <nav class="footer-nav">
          <a href="../index.html#home" class="t-link">Home</a>
          <a href="../index.html#work" class="t-link">Work</a>
          <a href="../index.html#about" class="t-link">About</a>
        </nav>
        <img src="assets/shared/footer-icon.png" alt="" class="footer-avatar">
        <p class="t-default footer-quote">
          "This is for everyone going through tough times, been there done that, but everyday above ground is a great day remember that."
        </p>
        <div class="footer-socials">
          <a href="mailto:crystalchiu09@gmail.com" aria-label="Email">
            <img src="assets/shared/icon-mail.svg" alt="Email" width="24" height="24">
          </a>
          <a href="https://www.linkedin.com/in/crystalchiu01/" target="_blank" aria-label="LinkedIn">
            <img src="assets/shared/icon-linkedin.svg" alt="LinkedIn" width="24" height="24">
          </a>
        </div>
      </div>
    </div>
  </footer>

  <script src="../nav.js"></script>
</body>
</html>
`;

fs.writeFileSync(out, html);
console.log('Generated:', out);
