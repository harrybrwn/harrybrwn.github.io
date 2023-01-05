import type { APIContext, EndpointOutput } from "astro";
import bookmarks from "../../bookmarks.json";

export const get = async (
  context: APIContext
): Promise<EndpointOutput | Response> => {
  return {
    body: JSON.stringify(bookmarks),
  };
};
