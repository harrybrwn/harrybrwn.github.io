import { defineConfig } from "astro/config";
import path from "path";
import fs from "fs";

import node from "@astrojs/node";
import netlify from "@astrojs/netlify/functions";
import cloudflare from "@astrojs/cloudflare";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import purgecss from "astro-purgecss";
import obsidian from "@astro.hrry.dev/obsidian";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import compress from "@astro.hrry.dev/compress";
import { gardenBasePath } from "./src/config";

const domain = fs.readFileSync("public/CNAME").toString().trim();
const site = `https://${domain}`;
const outDir = "./dist";
const siteMapFilter = new Set(["admin"]);

// check for "false" so that netlify is default
const isNetlify = process.env.NETLIFY === "false" ? false : true;
const isCloudflare = process.env.CLOUDFLARE_ACCOUNT_ID ? true : false;
let output = process.env.ASTRO_OUTPUT || "static";
if (isNetlify) {
  output = "hybrid";
  console.log("building for netlify");
}

// https://astro.build/config
export default defineConfig({
  site: site,
  outDir: outDir,
  output: output,
  adapter: isNetlify
    ? netlify()
    : isCloudflare
      ? cloudflare()
      : output === "server"
        ? node({ mode: "middleware" })
        : undefined,
  build: {
    assets: "a",
    inlineStylesheets: "auto",
  },
  markdown: {
    syntaxHighlight: "prism",
  },
  server: {
    port: 3000,
  },
  compressHTML: true,
  vite: {
    plugins: [ViteYaml()],
    build: {
      // request/response header size is around 500 bytes
      assetsInlineLimit: 512,
      rollupOptions: {
        output: {
          assetFileNames: "a/[hash][extname]",
        },
      },
      // https://github.com/Ernxst/astro-cssbundle
      cssCodeSplit: true,
    },
  },
  redirects: {
    "/help": { destination: "/about/index.html", status: 301 },
  },
  integrations: [
    mdx(),
    solid(),
    // https://purgecss.com/configuration.html
    purgecss(),
    sitemap({
      customPages: [],
      filter: (page) => !siteMapFilter.has(path.basename(page)),
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
    obsidian({ urlBase: gardenBasePath, baseDir: "./content" }),
  ],
});
