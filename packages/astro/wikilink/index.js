import path from "path";
import remarkWikiLink from "remark-wiki-link-plus";

let links = {};

const imageExts = new Set([".png", ".jpg", ".jpeg"]);

const plugin = (opts = {}) => {
  if (!opts.base) opts.base = "";
  return [
    // https://github.com/landakram/remark-wiki-link#configuration-options
    remarkWikiLink,
    {
      aliasDivider: "|",
      wikiLinkClassName: opts.wikiLinkClassName || "wiki-link",
      newClassName: opts.newClassName || "wip",
      markdownFolder: opts.content || "./content",
      pageResolver: (name) => {
        const res = slug(name, true);
        links[res] = {};
        return [res];
      },
      hrefTemplate: (permalink) => {
        if (imageExts.has(path.extname(permalink))) {
          // This is an image
        }
        if (permalink.startsWith("#")) return permalink;
        return path.join("/", opts.base, permalink);
      },
    },
  ];
};

export { links };
export default plugin;
