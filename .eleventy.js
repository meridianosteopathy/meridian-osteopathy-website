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
