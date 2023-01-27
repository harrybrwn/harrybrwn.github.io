/// <reference path="../../dist/index.js" />

import type { IncomingMessage, ServerResponse } from "http";

export function handler(
  req: IncomingMessage,
  res: ServerResponse,
  next?: (err?: unknown) => void
): Promise<any>;

export const pageMap: Map<string, any>;

export const renderers: Array<{
  name: string;
  clientEntrypoint: string;
  serverEntrypoint: string;
  jsxImportSource: string;
  ssr: any;
}>;
