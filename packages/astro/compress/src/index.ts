import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

import astroCompress from "astro-compress";
import type { AstroIntegration } from "astro";
import type {
  CssNode,
  StyleSheet,
  SelectorList,
  PseudoClassSelector,
  ClassSelector,
} from "css-tree";
import type { CompressOptions } from "csso";

const prefix = "astro-";

// This needs to be "a-" because it will also apply to astro's
// custom tags which breaks the html because "island" is not a
// valid custom element and "a-island" is.
//
// https://html.spec.whatwg.org/#valid-custom-element-name
const replacement = "a-";

/**
 * @param {import("css-tree").ClassSelector} selector
 */
const cleanClassName = (selector: ClassSelector) => {
  selector.name = selector.name.replace(prefix, replacement);
};

/**
 * @param {import("css-tree").SelectorList} ast
 * @param {*} callback
 */
const walkSelectorList = (
  ast: SelectorList | PseudoClassSelector,
  callback: (node: CssNode) => void
) => {
  if (!ast.children) return;
  for (let child of ast.children) {
    if (child.type === "SelectorList") {
      walkSelectorList(child, callback);
    } else if (child.type === "Selector") {
      for (let c of child.children) {
        callback(c);
      }
    } else {
      callback(child);
    }
  }
};

/**
 *
 * @param {import("css-tree").StyleSheet} ast
 * @param {import("csso").CompressOptions} _options
 */
const beforeCompress = (ast: StyleSheet, _options: CompressOptions) => {
  for (let n of ast.children) {
    if (n.type !== "Rule" || !n.prelude || n.prelude.type !== "SelectorList") {
      continue;
    }

    walkSelectorList(n.prelude, (ast) => {
      // Find all the "where" selectors and remove the "astro-" prefix
      if (ast.type !== "PseudoClassSelector" || ast.name !== "where") {
        return;
      }
      walkSelectorList(ast, (inner) => {
        if (inner.type !== "ClassSelector") return;
        cleanClassName(inner);
      });
    });
  }
};

/**
 * Astro 3.0 breaks all the stuff I've done here. This is a toggle to enable it
 * if I go back for some reason.
 */
const oldCleanClassnames = false;

/**
 *
 * @param {*} settings
 * @returns {import("astro").AstroIntegration}
 */
const compress = (settings: any): AstroIntegration => {
  let output: string | null = null;
  let prerendered = [];
  return {
    name: "clean-classnames",
    hooks: {
      "astro:config:setup": ({ config }) => {
        output = config.output;
        if (oldCleanClassnames && config.output === "static") {
          // Only remove 'astro-' for static sites because we can't remove the
          // prefix on SSR routes.
          if (!settings.css) settings.css = {};
          settings.css.beforeCompress = beforeCompress;
        }
        config.integrations.push(astroCompress(settings));
      },
      "astro:build:setup": (options) => {
        for (const [name, page] of options.pages.entries()) {
          if (page.route.type === 'page' && page.route.prerender === true) {
            prerendered.push(name);
          }
        }
      },
      "astro:build:done": async ({ pages, dir }) => {
        if (!oldCleanClassnames || output !== "static") {
          // Only remove 'astro-' for static sites because we can't remove the
          // prefix on SSR routes.
          return Promise.resolve();
        }
        // TODO check the list of prerendered pages to make sure a file should
        // be fixed.
        const files = pages.map(({ pathname }) => {
          if (path.basename(pathname) === "404") {
            return path.join(dir.pathname, "404.html");
          }
          return path.join(dir.pathname, pathname, "index.html");
        });
        const pattern = new RegExp(`class=".*?${prefix}.*?"`, "g");
        await Promise.all(
          files.map(async (f) => {
            let blob = fs.readFileSync(f).toString();
            // find class names containing "astro-"
            let matches = blob.matchAll(pattern);
            for (let m of matches) {
              blob = blob.replaceAll(
                m[0],
                m[0].replaceAll(prefix, replacement)
              );
            }
            await writeFile(f, blob);
          })
        );
      },
    },
  };
};

export default compress;
