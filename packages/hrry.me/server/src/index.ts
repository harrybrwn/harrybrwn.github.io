#!/usr/bin/env node

import express from "express";
import morgan from "morgan";
import { handler as ssrHandler } from "../../../../dist/server/index.js";

const format =
  `{` +
  `"method":":method",` +
  `"url":":url",` +
  `"remote_addr":":remote-addr",` +
  `"user":":remote-user",` +
  `"http_version":":http-version",` +
  `"status"::status,` +
  `"content_length"::res[content-length],` +
  `"response_time_ms"::response-time` +
  `}`;
const app = express();
app.disable("x-powered-by");

app.use(morgan(format));
app.use(express.static("dist/client/"));
// Requires adapter: node({ mode: "middleware" })
app.use(ssrHandler);

const port = parseInt(process.env.PORT || "3000");
const host = process.env.HOST || "127.0.0.1";

const server = app.listen(port, host, () => {
  console.log(`listening on port ${port}`);
});

process.on("SIGINT", () => {
  server.close((err?: Error) => {
    if (err) console.error(`Shutting down server with error: ${err}`);
    else console.log("Shutting down server");
  });
  process.exit();
});
