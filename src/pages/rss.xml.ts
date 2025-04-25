import rss from "@astrojs/rss";
import type { RSSFeedItem } from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
//import path from "~/lib/path";
//import { getCollection, type ContentEntryMap } from "astro:content";
//import { collections } from "~/content/config";

export const GET = async () => {
  // let posts = [];
  // for (const k in collections) {
  //   let c = await getCollection(k as keyof ContentEntryMap, ({ data }) => {
  //     console.log(data);
  //     return !data.draft;
  //   });
  //   // console.log(c);
  //   posts.push(...(await getCollection(k as keyof ContentEntryMap)));
  // }
  // const items = posts.filter((p) => !p.data.draft).map((p) => {
  //   return {
  //     link: p.collection === "garden"
  //       ? path.join(gardenBasePath, p.slug)
  //       : path.join("blog", p.slug),
  //     title: p.data.title,
  //     pubDate: p.data.pubDate,
  //     description: p.data.description,
  //     categories: p.data.tags,
  //   };
  // });
  let items: RSSFeedItem[] = [];
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items,
  });
};
