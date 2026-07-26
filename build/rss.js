/*
  - Generates rss.xml at the project root from every page in pages.json that
  has a "feed" key attached to it. The others are skipped.

  - Called from build.js after the HTML pages are written, so it
  regenerates both in one step.
*/
"use strict";
const fs = require("fs");
const path = require("path");

// escape the 5 XML special characters so arbitrary strings (titles,
// descriptions, tags, etc.) can be safely embedded inside XML tags without
// breaking the markup
function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// transform a path like "posts/red/index.html" into a clean absolute URL
// like "https://brynrefill.com/posts/red/"
function outPathToUrl(siteUrl, outPath) {
  // strip a trailing "index.html" since that's implied by the folder URL
  let clean = outPath.replace(/index\.html$/, "");

  // ensure that the remainder ends with a single trailing slash (unless it's
  // empty, i.e. the site root, which gets handled by the join below)
  if (!clean.endsWith("/") && clean !== "") clean += "/";

  // join siteUrl + clean path, then collapse any accidental "//" that could
  // appear at the junction point (but leave "https://" intact, hence the [^:] guard)
  return `${siteUrl}/${clean}`.replace(/([^:])\/{2,}/g, "$1/");
}

// convert a plain "YYYY-MM-DD" date string into the RFC 822 format RSS
// requires for <pubDate>
function toRfc822(isoDate) {
  // pages only carry a date (no time), so anchor every item at midnight UTC
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

// build rss.xml from the site's pages and write it to rootDir/rss.xml.
// "pages" is the same array used by build.js; "site" holds site-wide config
// (feed title/description, base URL, etc)
function generateFeed(pages, site, rootDir) {
  // only pages with a "feed" key become RSS items; everything else (e.g.
  // static pages like "About" or "Contact") is skipped. Sort newest first
  const items = pages
    .filter((p) => p.feed)
    .sort((a, b) => (a.feed.date < b.feed.date ? 1 : -1));

  // build the XML for each <item> and join them all together
  const itemsXml = items
    .map((page) => {
      const url = outPathToUrl(site.siteUrl, page.out);

      // turn this page's tags (if any) into one <category> line per tag
      const categories = (page.feed.tags || [])
        .map((t) => `            <category>${escapeXml(t)}</category>`)
        .join("\n");
      return [
        "        <item>",
        `            <title>${escapeXml(page.title)}</title>`,
        `            <link>${url}</link>`,
        `            <guid isPermaLink="true">${url}</guid>`,
        `            <pubDate>${toRfc822(page.feed.date)}</pubDate>`,
        `            <description>${escapeXml(page.feed.description)}</description>`,
        categories,
        "        </item>",
      ]
        // drop the "categories" line entirely when the page has no tags,
        // so we don't leave a blank line in the output
        .filter((line) => line !== "")
        .join("\n");
    })
    .join("\n");

  // <lastBuildDate> uses the newest item's date, or right now if there are
  // no feed items at all
  // const lastBuildDate = items.length ? toRfc822(items[0].feed.date) : new Date().toUTCString();

  // set to the time the RSS feed is generated, so feed readers can detect updates
  // (e.g. when edited existing posts or descriptions)
  const lastBuildDate = new Date().toUTCString();

  // assemble the full RSS 2.0 document: channel-level metadata followed by
  // all the <item> blocks generated above
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <title>${escapeXml(site.feedTitle)}</title>
        <link>${site.siteUrl}/</link>
        <description>${escapeXml(site.feedDescription)}</description>
        <language>en-US</language>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${site.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
    </channel>
</rss>
`;

  // write the finished feed to <rootDir>/rss.xml
  fs.writeFileSync(path.join(rootDir, "rss.xml"), xml, "utf8");
  console.log(`built rss.xml (${items.length} items)`);
}

// exposed so build.js can call generateFeed(pages, site, ROOT) after it
// finishes writing the HTML pages
module.exports = { generateFeed };
