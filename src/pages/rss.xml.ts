import path from "path";
import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION, gardenBasePath } from "../config";
import { getPosts, slug } from "~/lib/blog";
import GithubSlugger from "github-slugger";

export const get = async () => {
  const posts = await getPosts({ drafts: import.meta.env.DEV });
  const slugger = new GithubSlugger();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: posts.map((p) => ({
      link: p.url || path.join(gardenBasePath, slug(p, true, slugger)),
      title: p.frontmatter.title,
      pubDate: new Date(p.frontmatter.pubDate),
      description: p.frontmatter.description,
      content: p.compiledContent(),
    })),
  });
};
