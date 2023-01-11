import { defineConfig } from "astro/config";
import path from "path";
import fs from "fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import purgecss from "astro-purgecss";
import compress from "./src/lib/configHelpers.js";
import obsidian from "@astro.hrry.dev/obsidian";

const domain = fs.readFileSync("public/CNAME").toString().trim();
const site = `https://${domain}`;
const outDir = "./dist";
const filter = new Set(["admin"]);

// https://astro.build/config
export default defineConfig({
  site: site,
  outDir: outDir,
  markdown: {
    syntaxHighlight: "prism",
  },
  vite: {
    build: {
      // request/response header size is around 500 bytes
      assetsInlineLimit: 512,
      rollupOptions: {
        output: {
          entryFileNames: "[hash].js",
          // "a" for "assets"
          assetFileNames: "a/[hash][extname]",
          //assetFileNames: "a/[name].[hash][extname]",
        },
      },
      // https://github.com/Ernxst/astro-cssbundle
      cssCodeSplit: true,
    },
  },
  integrations: [
    mdx(),
    solid(),
    // https://purgecss.com/configuration.html
    purgecss(),
    sitemap({
      customPages: [],
      filter: (page) => !filter.has(path.basename(page)),
    }),
    compress({
      path: outDir,
      html: {
        removeComments: true,
        removeAttributeQuotes: false,
        // sorting does not effect size but can improve text compression
        sortAttributes: true,
        sortClassName: true,
        removeRedundantAttributes: true,
      },
      img: {
        gif: false, // compressing gifs removes the animation
      },
      logger: 0,
    }),
    obsidian({ urlBase: "/garden/", baseDir: "./content" }),
  ],
});
