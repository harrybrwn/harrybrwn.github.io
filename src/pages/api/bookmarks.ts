import bookmarks from "../../bookmarks.yml";

export const prerender = true;

export const GET = () => new Response(JSON.stringify(bookmarks));
