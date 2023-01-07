import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const prefix = "astro-";

const mapSelectorList = (ast, callback) => {
  for (let sel = ast.children.head; sel != null; sel = sel.next) {
    let node = sel.data;
    if (node.type !== "Selector") {
      continue;
    }
    for (let ch = node.children.head; ch != null; ch = ch.next) {
      callback(ch.data);
    }
  }
};

const cleanPseudoSelector = (ast, searchStr, replacement) => {
  for (let child = ast.children.head; child != null; child = child.next) {
    mapSelectorList(child.data, (inner) => {
      let s = "";
      inner.name = inner.name.replace(searchStr, replacement);
    });
  }
};

const beforeCompress = (ast, options) => {
  for (let node = ast.children.head; node != null; node = node.next) {
    if (!node.data.prelude || node.data.prelude.type !== "SelectorList") {
      continue;
    }
    mapSelectorList(node.data.prelude, (ast) => {
      // Find all the "where" selectors and remove the "astro-" prefix
      if (ast.type === "PseudoClassSelector" && ast.name === "where") {
        cleanPseudoSelector(ast, prefix, "");
      }
    });
  }
};

import astroCompress from "astro-compress";

const compress = (settings) => {
  if (!settings.css) {
    settings.css = {};
  }
  settings.css.beforeCompress = beforeCompress;
  return {
    name: "clean-classnames",
    hooks: {
      "astro:config:setup": (opts) => {
        opts.config.integrations.push(astroCompress(settings));
      },
      "astro:build:done": async (opts) => {
        await Promise.all(
          opts.routes
            .filter(
              (r) => r.distURL && path.extname(r.distURL.pathname) === ".html"
            )
            .map(async ({ distURL }) => {
              await writeFile(
                distURL.pathname,
                fs
                  .readFileSync(distURL.pathname)
                  .toString()
                  .replaceAll(prefix, "")
              );
            })
        );
      },
    },
  };
};

export default compress;
