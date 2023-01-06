import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import compress from "astro-compress";
import purgecss from "astro-purgecss";
import path from "path";
import fs from "fs";
import { beforeCompress } from "./src/lib/configHelpers";

const site = "https://harrybrwn.github.io";
const outDir = "./dist";
const cleanClassNames = {
  name: "clean-classnames",
  hooks: {
    "astro:build:done": (opts) => {
      for (let r of opts.routes) {
        if (!r.distURL) {
          console.warn("Warning no distURL:", r.component);
          continue;
        }
        const ext = path.extname(r.distURL.pathname);
        if (ext !== ".html") {
          continue;
        }
        let data = fs
          .readFileSync(r.distURL.pathname)
          .toString()
          .replaceAll("astro-", "");
        fs.writeFileSync(r.distURL.pathname, data);
      }
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: site,
  outDir: outDir,
  vite: {
    build: {
      // request/response header size is around 500 bytes
      assetsInlineLimit: 512,
      rollupOptions: {
        output: {
          entryFileNames: "[hash].js",
          // "a" for "assets"
          assetFileNames:
            import.meta.env.DEBUG === "true"
              ? "a/[name].[hash][extname]"
              : "a/[hash][extname]",
        },
      },
      // https://github.com/Ernxst/astro-cssbundle
    },
  },
  integrations: [
    mdx(),
    solid(),
    // https://purgecss.com/configuration.html
    purgecss(),
    sitemap({
      customPages: [],
      filter: (page) => {
        switch (page) {
          case `${site}/admin/`:
            return false;
          default:
            return true;
        }
      },
    }),
    compress({
      path: outDir,
      html: {
        removeComments: true,
        removeAttributeQuotes: false,
        // sorting does not effect size but can improve gzip compression
        sortAttributes: true,
        sortClassName: true,
        removeRedundantAttributes: true,
      },
      css: {
        beforeCompress: beforeCompress,
      },
      img: {
        gif: false, // compressing gifs removes the animation
      },
    }),
    cleanClassNames,
  ],
});
