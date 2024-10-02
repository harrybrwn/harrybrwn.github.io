import path from "path";
import type { AstroIntegration } from "astro";
import remarkWikiLink from "remark-wiki-link-plus";

export interface Options {
  baseDir?: string;
  urlBase?: string;
}

const markdownExts = new Set([".md", ".mdx", ".markdown"]);
const imageExts = new Set([".png", ".jpg", ".jpeg"]);

const defaultURLBase = "/";
const defaultBaseDir = "./content";

const newMarkdownPlugin = (opts: Options) => {
  const urlBase = opts.urlBase || defaultURLBase;
  const baseDir = opts.baseDir || defaultBaseDir;
  return [
    remarkWikiLink,
    {
      aliasDivider: "|",
      wikiLinkClassName: "wiki-link",
      newClassName: "wip",
      markdownFolder: baseDir,
      hrefTemplate: (permalink: string) => {
        if (imageExts.has(path.extname(permalink))) {
          // This is an image
        }
        if (permalink.startsWith("#")) return permalink;
        return path.join("/", urlBase, permalink);
      },
    },
  ];
};

import { type Plugin } from "vite";

const plugin = (opts: Options): AstroIntegration => {
  if (!opts) opts = {};
  if (!opts.baseDir) opts.baseDir = defaultBaseDir;
  if (!opts.urlBase) opts.urlBase = defaultURLBase;

  const vitePlugin: Plugin = {
    name: "astro-markdown-assets",
    enforce: "pre",
    // transform(_code: string, id: string) {
    //   // TODO: resolve image imports and document embeds that are imported into markdown
    //   // TODO:
    //   //  - ![[Document Name]]
    //   //  - ![[image.png]]
    //   //  - ![](image.png)
    //   // See: https://vkbansal.me/blog/resolving-images-astro-md/
    //   if (!markdownExts.has(path.extname(id))) return null;
    //   return null;
    // },
    transform(_code, id, _options) {
      // TODO: resolve image imports and document embeds that are imported into markdown
      // TODO:
      //  - ![[Document Name]]
      //  - ![[image.png]]
      //  - ![](image.png)
      // See: https://vkbansal.me/blog/resolving-images-astro-md/
      if (!markdownExts.has(path.extname(id))) return null;
      return null;
    },
  };
  const md = newMarkdownPlugin(opts);

  return {
    name: "astro-obsidian",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          markdown: { remarkPlugins: [md] },
          vite: { plugins: [vitePlugin] },
        });
      },
    },
  };
};

export default plugin;
