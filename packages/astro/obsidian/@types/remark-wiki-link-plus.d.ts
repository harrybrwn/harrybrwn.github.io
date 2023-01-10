// / <reference path="../node_modules/remark-wiki-link-plus/dist/index.js" />

declare module "remark-wiki-link-plus" {
  export type Options = {
    aliasDivider?: string;
    wikiLinkClassName?: string;
    newClassName?: string;
    markdownFolder?: string;
    pageResolver?: (name: string) => string[];
    hrefTemplate?: (permalink: string) => string;
  };
  export const wikiLinkPlugin: (opts: Options) => void;
  export default wikiLinkPlugin;
}
