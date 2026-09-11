// Shared front-matter defaults for everything under src/blog/.
// The listing page (src/blog/index.njk) supplies its own permalink and
// layout in its front matter, so it overrides these defaults. The
// per-post files under src/blog/posts/ inherit them.
module.exports = {
  layout: "post.njk",
  tags: "post",
  eleventyComputed: {
    // Post URL = /blog/<file-slug>/. The listing page has its own
    // permalink in its front matter and does not inherit this.
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      return `/blog/${data.page.fileSlug}/`;
    },
    // `updated` on the base layout drives the visible "Last updated"
    // line and the WebPage dateModified. For posts, prefer any explicit
    // updated date; otherwise fall back to publishedDate.
    updated: (data) => data.updated || data.publishedDate,
  },
};
