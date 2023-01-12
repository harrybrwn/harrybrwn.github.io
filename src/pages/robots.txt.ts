import { robots } from "@astro.hrry.dev/robots.txt";

export const get = robots({
  sitemap: ["sitemap-index.xml", "sitemap-0.xml"],
  crawlers: [
    {
      agent: "Googlebot",
      disallow: ["/nogooglebot/"],
    },
    {
      agent: ["AhrefsBot", "rogerbot"],
      delay: 10,
    },
    {
      agent: "yandex",
      delay: 60,
    },
    {
      agent: "*",
      allow: ["/", "/blog/", "/garden/", "/bookmarks/", "/static/"],
      disallow: ["/admin", "/api"],
    },
  ],
});
