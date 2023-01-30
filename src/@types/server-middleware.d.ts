/// <reference path="../../dist/index.js" />

import type { IncomingMessage, ServerResponse } from "http";

declare function handler(
  req: IncomingMessage,
  res: ServerResponse,
  next?: (err?: unknown) => void
): Promise<any>;

declare const pageMap: Map<string, any>;

declare const renderers: Array<{
  name: string;
  clientEntrypoint: string;
  serverEntrypoint: string;
  jsxImportSource: string;
  ssr: any;
}>;
