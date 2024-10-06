import path from "path";
import type { AstroIntegration } from "astro";
import { type Plugin } from "vite";
import remarkWikiPlugin from "remark-wiki-link";

export interface Options {
  baseDir?: string;
  urlBase?: string;
}

const markdownExts = new Set([".md", ".mdx", ".markdown"]);
const imageExts = new Set([".png", ".jpg", ".jpeg"]);

const defaultURLBase = "/";
const defaultBaseDir = "./content";

const plugin = (opts: Options): AstroIntegration => {
  if (!opts.baseDir) opts.baseDir = defaultBaseDir;
  const urlBase = opts.urlBase || defaultURLBase;

  const remarkPlugin = [
    remarkWikiPlugin,
    {
      aliasDivider: '|',
      wikiLinkClassName: "wiki-link",
      markdownFolder: opts.baseDir,
      pageResolver: (name: string) => {
        return [name.replace(/ /g, '-')];
      },
      hrefTemplate: (permalink: string) => {
        if (imageExts.has(path.extname(permalink))) {
          // This is an image
        }
        if (permalink.startsWith("#")) return permalink;
        let link = permalink;
        const pound = permalink.indexOf("#");
        if (pound > 0) {
          let fragment = permalink.slice(pound + 1).replace(/ /g, "-").toLowerCase();
          permalink = permalink.slice(0, pound);
          link = fragment + "#" + link;
        }
        return path.join("/", urlBase, link);
      },
    }
  ];

  const vitePlugin: Plugin = {
    name: "astro-markdown-assets",
    enforce: "pre",
    transform(_code, id, _options) {
      if (!markdownExts.has(path.extname(id))) return null;
      // TODO: resolve image imports and document embeds that are imported into markdown
      // TODO:
      //  - ![[Document Name]]
      //  - ![[image.png]]
      //  - ![](image.png)
      // See: https://vkbansal.me/blog/resolving-images-astro-md/
      return null;
    },
  };

  return {
    name: "astro-obsidian",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [
              remarkPlugin,
            ],
          },
          vite: {
            plugins: [vitePlugin],
          }
        });
      }
    }
  };
};

export default plugin;
