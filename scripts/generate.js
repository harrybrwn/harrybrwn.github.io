import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import walk from "walkdir";

const gatherModDates = (dir) => {
  let files = {};
  walk.sync(dir, function (filename, stat) {
    if (stat.isDirectory()) return;
    if (path.extname(filename) !== ".md") return;
    const name = path.relative(process.cwd(), filename);
    const cmd = spawnSync("git", [
      "--no-pager",
      "log",
      "--pretty=format:%cd",
      name,
    ]);
    files[name] = cmd.stdout
      .toString()
      .split("\n")
      .map((s) => (s.length > 0 ? new Date(s) : new Date()));
  });
  return files;
};

const modified = gatherModDates("./content");
const out = "src/modified.json";
fs.writeFileSync(out, JSON.stringify(modified, null, 2));
console.log("modified times written to", out);
