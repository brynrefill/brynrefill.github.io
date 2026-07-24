/*
  - It reassembles every page of the site from a single layout + shared components
  (header, footer, aside) + per-page content fragments listed in pages.json.
*/
"use strict";
const fs = require("fs");
const path = require("path");

// ROOT = the project root (one level up from this build/ folder)
// where the generated pages are written
const ROOT = path.resolve(__dirname, "..");

// BUILD = this build/ folder itself
const BUILD = __dirname;

// helper: read a file relative to the build/ folder as UTF-8 text, and strip
// a single trailing newline (so concatenating pieces later doesn't leave
// stray blank lines)
function read(relToBuild) {
  return fs.readFileSync(path.join(BUILD, relToBuild), "utf8").replace(/\n$/, "");
}

// site-wide config (things like the jQuery <script> tag to embed, and the
// copyright year for the footer)
const site = JSON.parse(fs.readFileSync(path.join(BUILD, "site.json"), "utf8"));

// per-page config: an array of page objects (title, which content file to
// use, which nav item is "active", output path, etc)
const pages = JSON.parse(fs.readFileSync(path.join(BUILD, "pages.json"), "utf8"));

// the main HTML template. It contains {{PLACEHOLDER}} tokens that are replaced
// based on the page (TITLE, HEADER, CONTENT, ASIDE, FOOTER, etc)
const layout = fs.readFileSync(path.join(BUILD, "layout.html"), "utf8");

// shared header/footer/sidebar HTML snippets, reused across every page.
// Footer also gets its {{YEAR}} token filled in once, at the initial stage,
// since it's the same for every page
const headerComponent = read("components/header.html");
const footerComponent = read("components/footer.html").replace("{{YEAR}}", site.copyrightYear);
const asideComponent = read("components/aside.html");

// CSS classes injected into the header nav to visually mark the current page.
// NAV_ACTIVE highlights a top-level nav item; SUBNAV_ACTIVE highlights a
// second-level (sub-menu) item, e.g. "About" living under "Extras"
const NAV_ACTIVE = ' class="current-page keyword"';
const SUBNAV_ACTIVE = ' class="current-subitem keyword"';

// builds the <header> HTML for a given page by deciding which nav item(s)
// should get the "active" class, then substituting those classes into the
// header component's {{NAV_*}} placeholders
function buildHeader(active) {
  // start with every nav placeholder resolving to "" (i.e. not active)
  const cls = {
    NAV_HOME: "",
    NAV_POSTS: "",
    NAV_TAGS: "",
    NAV_CONTACT: "",
    NAV_EXTRAS: "",
    NAV_ABOUT: "",
  };

  // turn on the class(es) matching this page's "active" nav section.
  // "about" is a special case: it's a sub-item under the "Extras" top-level
  // menu, so both the parent (NAV_EXTRAS) and the child (NAV_ABOUT) light up
  if (active === "home") cls.NAV_HOME = NAV_ACTIVE;
  else if (active === "posts") cls.NAV_POSTS = NAV_ACTIVE;
  else if (active === "tags") cls.NAV_TAGS = NAV_ACTIVE;
  else if (active === "contact") cls.NAV_CONTACT = NAV_ACTIVE;
  else if (active === "about") {
    cls.NAV_EXTRAS = NAV_ACTIVE;
    cls.NAV_ABOUT = SUBNAV_ACTIVE;
  }

  // replace each {{NAV_*}} token in the header component with its computed
  // class string (or "" if that nav item isn't active)
  let html = headerComponent;
  for (const [key, val] of Object.entries(cls)) {
    html = html.replace(`{{${key}}}`, val);
  }
  return html;
}

// builds the <aside>/sidebar HTML by dropping page-specific content
// (asideContents, from pages.json) into the shared aside component
function buildAside(asideContents) {
  return asideComponent.replace("{{ASIDE_CONTENTS}}", asideContents);
}

// main build loop: for every page defined in pages.json, assemble the full
// HTML document and write it down
for (const page of pages) {
  // load this page's unique content fragment (e.g. build/content/extras/about.html)
  const content = read(page.contentFile);

  // only include the syntax-highlighter CSS/JS on pages that enable it via
  // `page.highlighter` (e.g. posts with code blocks). Other pages get ""
  const highlighterCss = page.highlighter
    ? '    <link rel="stylesheet" href="/styles/highlighter.css">\n'
    : "";
  const highlighterJs = page.highlighter
    ? '    <script type="text/javascript" src="/scripts/highlighter.js"></script>\n'
    : "";

    // optional extra markup appended after the shared footer, per page
  const footerExtra = page.footerExtra ? page.footerExtra + "\n" : "";

  // take the main layout template and substitute every {{TOKEN}} with the
  // page-specific or shared content computed above
  let html = layout
    .replace("{{TITLE}}", page.title)
    .replace("{{HIGHLIGHTER_CSS}}", highlighterCss)
    .replace("{{JQUERY_TAG}}", site.jqueryTag)
    .replace("{{HEADER}}", buildHeader(page.active))
    .replace("{{CONTENT}}", content)
    .replace("{{ASIDE}}", buildAside(page.asideContents))
    .replace("{{FOOTER}}", footerComponent)
    .replace("{{HIGHLIGHTER_JS}}", highlighterJs)
    .replace("{{FOOTER_EXTRA}}", footerExtra);

  // write the finished page to its output path (e.g. ROOT/extras/about/index.html),
  // creating any missing directories along the way
  const outPath = path.join(ROOT, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  console.log(`built ${page.out}`);
}
