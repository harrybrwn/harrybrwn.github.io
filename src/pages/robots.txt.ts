import { robots } from "@astro.hrry.dev/robots.txt";

// https://www.foundationwebdev.com/2023/11/which-web-crawlers-are-associated-with-ai-crawlers/
const llms = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "anthropic-ai",
  "Claude-Web",
  // AppleAI
  "Applebot-Extended",
  // bytedance
  "Bytespider",
  // Cohere AI
  "cohere-ai",
  // Meta
  "FacebookBot",
  // Google
  "Google-Extended",
  // webz.io
  "OmigiliBot",
  "Omigili",
];

export const GET = robots({
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
    ...llms.map((agent: string) => ({
      agent,
      disallow: ["*"]
    })),
    {
      agent: "*",
      allow: ["/", "/blog/", "/garden/", "/bookmarks/", "/static/"],
      disallow: ["/admin", "/api"],
    },
  ],
});
