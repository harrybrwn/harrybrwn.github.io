import bookmarks from "../../bookmarks.json";

export const get = () => ({
  body: JSON.stringify(bookmarks),
});
