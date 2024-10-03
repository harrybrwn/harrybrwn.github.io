import type { APIContext, APIRoute } from "astro";

export type Crawler = {
  agent: string | string[];
  allow?: string[] | undefined | null;
  disallow?: string[] | undefined | null;
  delay?: number;
};

export type Options = {
  crawlers: Crawler[];
  sitemap: string | string[];
};

export const robots = (opts: Options): APIRoute => {
  return (context: APIContext) => {
    let lines: Array<string> = [];
    const origin = context.site?.origin;
    if (Array.isArray(opts.sitemap)) {
      const sitemaps = opts.sitemap.map((s) => `Sitemap: ${origin}/${s}`);
      lines.push(...sitemaps);
    } else {
      lines.push(`Sitemap: ${origin}/${opts.sitemap}`);
    }
    lines.push("");

    for (const crawler of opts.crawlers) {
      if (Array.isArray(crawler.agent)) {
        lines.push(...crawler.agent.map((a) => `User-agent: ${a}`));
      } else {
        lines.push(`User-agent: ${crawler.agent}`);
      }

      if (crawler.allow)
        for (const allow of crawler.allow) lines.push(`Allow: ${allow}`);
      if (crawler.disallow)
        for (const disallow of crawler.disallow)
          lines.push(`Disallow: ${disallow}`);
      if (crawler.delay) {
        lines.push(`Crawl-delay: ${crawler.delay}`);
      }
      lines.push("");
    }
    return new Response(lines.join("\n"));
  };
};

export const spiders = [
  "baiduspider",
  "baiduspider-image",
  "baiduspider-mobile",
  "baiduspider-news",
  "baiduspider-video",
  "bingbot",
  "msnbot",
  "msnbot-media",
  "adidxbot",
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-Mobile",
  "Googlebot-News",
  "Googlebot-Video",
  "Mediapartners-Google",
  "AdsBot-Google",
  "slurp",
  "yandex",
];
