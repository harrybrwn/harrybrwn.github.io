import bookmarks from "../../bookmarks.yml";

export const get = () => ({
  body: JSON.stringify(bookmarks),
});
