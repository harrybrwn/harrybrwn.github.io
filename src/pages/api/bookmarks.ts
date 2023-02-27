import bookmarks from "../../bookmarks.yml";

export const prerender = true;

export const get = () => ({
  body: JSON.stringify(bookmarks),
});
