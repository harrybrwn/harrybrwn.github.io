import path from "path";
import remarkWikiLink from "remark-wiki-link";
import { slug } from "github-slugger";

let links = {};

const plugin = (opts = {}) => {
  if (!opts.base) opts.base = "";
  return [
    // https://github.com/landakram/remark-wiki-link#configuration-options
    remarkWikiLink,
    {
      aliasDivider: "|",
      wikiLinkClassName: opts.wikiLinkClassName || "wiki-link",
      newClassName: opts.newClassName || "wip",
      pageResolver: (name) => {
        const res = slug(name, true);
        links[res] = {};
        return [res];
      },
      hrefTemplate: (permalink) => {
        return path.join("/", opts.base, permalink);
      },
    },
  ];
};

export { links };
export default plugin;
