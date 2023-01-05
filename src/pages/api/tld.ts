import type { APIContext, EndpointOutput } from "astro";

// Get a list of all top level domains.
export const get = async (
  context: APIContext
): Promise<EndpointOutput | Response> => {
  const res = await fetch("https://data.iana.org/TLD/tlds-alpha-by-domain.txt");
  const body = await res.text();
  const lines = body.toLowerCase().split("\n");
  return {
    body: JSON.stringify(lines.slice(1, lines.length - 1)),
  };
};
