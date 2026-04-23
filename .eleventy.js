module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/fonts");

  // Pass through robots.txt to site root (llms / sitemap are templates)
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // ISO-8601 date filter for sitemap lastmod
  eleventyConfig.addFilter("dateIso", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return d.toISOString().split("T")[0];
  });

  // Friendly human-readable date like "22 April 2026", for visible
  // "Last updated" lines. Freshness is a real AI-search ranking signal.
  eleventyConfig.addFilter("dateFriendly", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" });
  });

  // Unescape common HTML entities for plaintext output.
  // Chain with `| safe` in templates to prevent Nunjucks from re-escaping.
  eleventyConfig.addFilter("plain", (value) => {
    if (value == null) return "";
    return String(value)
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  });

  // Filter out items whose url starts with any of the given prefixes
  eleventyConfig.addFilter("excludePrefixes", (items, ...prefixes) => {
    return (items || []).filter((item) => {
      if (!item || !item.url) return false;
      return !prefixes.some((p) => item.url.startsWith(p));
    });
  });

  // Build breadcrumb trail from a URL path. Returns [] for home ("/").
  // Intermediate segments get title-cased from their slug; the final
  // segment can be overridden by the caller (e.g. using page.title).
  //
  // SKIP_SEGMENTS names folders that exist only as URL containers (no
  // index page). Including them in the trail would link to a 404, which
  // hurts both UX and AI-search schema credibility, so they're dropped.
  const SKIP_SEGMENTS = new Set(["services", "team"]);
  eleventyConfig.addFilter("breadcrumbs", (url) => {
    if (!url || url === "/") return [];
    const segments = url.split("/").filter(Boolean);
    const crumbs = [];
    let cumulative = "";
    for (const seg of segments) {
      cumulative += "/" + seg;
      if (SKIP_SEGMENTS.has(seg)) continue;
      const name = seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ name, url: cumulative + "/" });
    }
    return crumbs;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
