import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import walk from "walkdir";

const gatherModDates = (files, collection, dir) => {
  walk.sync(dir, function (filename, stat) {
    if (stat.isDirectory()) return;
    if (path.extname(filename) !== ".md") return;
    // const name = path.relative(process.cwd(), filename);
    const name = path.relative(path.join(process.cwd(), dir), filename);
    const loc = path.relative(process.cwd(), filename);
    const cmd = spawnSync("git", [
      "--no-pager",
      "log",
      "--pretty=format:%cd",
      loc,
    ]);
    const dates = cmd.stdout
      .toString()
      .split("\n")
      .map((s) => (s.length > 0 ? new Date(s) : new Date()));
    files[name] = dates;
  });
  return files;
};

let files = {};
gatherModDates(files, "", "./content");
// gatherModDates(files, "", "./src/content/garden");
// gatherModDates(files, "", "./src/content/blog");
console.log(files);
// const out = "src/modified.json";
// fs.writeFileSync(out, JSON.stringify(modified, null, 2));
// console.log("modified times written to", out);
