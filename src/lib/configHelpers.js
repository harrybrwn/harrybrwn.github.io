import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import astroCompress from "astro-compress";

const prefix = "astro-";

// This needs to be "a-" because it will also apply to astro's
// custom tags which breaks the html because "island" is not a
// valid custom element and "a-island" is.
//
// https://html.spec.whatwg.org/#valid-custom-element-name
const replacement = "a-";

/**
 *
 * @param {import("css-tree").CssNode} ast
 * @param {*} callback
 */
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

/**
 *
 * @param {import("css-tree").CssNode} ast
 * @param {string|Regexp} searchStr
 * @param {string} replacement
 */
const cleanPseudoSelector = (ast, searchStr, replacement) => {
  for (let child = ast.children.head; child != null; child = child.next) {
    mapSelectorList(child.data, (inner) => {
      inner.name = inner.name.replace(searchStr, replacement);
    });
  }
};

/**
 *
 * @param {import("css-tree").CssNode} ast
 * @param {import("csso").CompressOptions} options
 */
const beforeCompress = (ast, options) => {
  for (let node = ast.children.head; node != null; node = node.next) {
    if (!node.data.prelude || node.data.prelude.type !== "SelectorList") {
      continue;
    }
    mapSelectorList(node.data.prelude, (ast) => {
      // Find all the "where" selectors and remove the "astro-" prefix
      if (ast.type === "PseudoClassSelector" && ast.name === "where") {
        cleanPseudoSelector(ast, prefix, replacement);
      }
    });
  }
};

/**
 *
 * @param {*} settings
 * @returns {import("astro").AstroIntegration}
 */
const compress = (settings) => {
  if (!settings.css) settings.css = {};
  settings.css.beforeCompress = beforeCompress;
  return [
    astroCompress(settings),
    {
      name: "clean-classnames",
      hooks: {
        "astro:build:done": async ({ pages, dir }) => {
          const files = pages.map(({ pathname }) => {
            if (path.basename(pathname) === "404") {
              return path.join(dir.pathname, "404.html");
            }
            return path.join(dir.pathname, pathname, "index.html");
          });
          await Promise.all(
            files.map(async (f) => {
              await writeFile(
                f,
                fs
                  .readFileSync(f)
                  .toString()
                  .replaceAll(prefix, replacement)
                  .replaceAll(`${replacement}code`, "astro-code") // revert markdown classes
              );
            })
          );
        },
      },
    },
  ];
};

export default compress;
