import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import walk from "walkdir";

// This is the date that I moved all content from './content' to
// './src/content/blog' and './src/content/garden'
const pivot = new Date("2024-10-14T23:26:31.173Z");

const FILENAME = "src/modified.json";

const findPubDate = (s) => {
  const m = s.match(/pubDate:\s*(.*)\n/);
  if (m === null) return null;
  if (m.length < 2) return null;
  return new Date(m[1]);
};

const findModDate = (s) => {
  const m = s.match(/modDate:\s*(.*)\n/);
  if (m === null) return null;
  if (m.length < 2) return null;
  return new Date(m[1]);
};

class Modified {
  constructor() {
    const blob = fs.readFileSync(FILENAME);
    this.files = {};
    this.prev = JSON.parse(blob.toString());
    for (const k in this.prev) {
      let p = this.prev[k];
      if (p.pubDate) {
        p.pubDate = new Date(p.pubDate);
      }
      if (p.modDate) {
        p.modDate = new Date(p.modDate);
      }
      p.modified = p.modified.map((v) => new Date(v));
      this.prev[k] = p;
      this.files[k] = {
        pubDate: p.pubDate,
        modDate: null,
        modified: [],
      };
    }
  }

  gather(dir) {
    walk.sync(dir, (filename, stat) => {
      if (stat.isDirectory() || path.extname(filename) !== ".md") return;
      const content = fs.readFileSync(filename);
      const s = content.toString();
      const pubDate = findPubDate(s),
        modDate = findModDate(s);
      const name = path.relative(path.join(process.cwd(), "src/content"), filename);
      const loc = path.relative(process.cwd(), filename);
      const cmd = spawnSync("git", [
        "--no-pager",
        "log",
        "--pretty=format:%cd",
        loc,
      ]);
      const lines = cmd.stdout.toString().split("\n");
      let dates = lines
        .map((s) => (s.length > 0 ? new Date(s) : new Date()))
        .filter((d) => d > pivot);
      const prev = this.prev[name];
      if (prev) {
        dates = dates.filter((d) => {
          for (const m of prev.modified) {
            if (m.getTime() === d.getTime()) return false;
          }
          return true;
        });
        const merged = [
          ...dates,
          ...prev.modified,
        ];
        this.files[name].modified = merged.sort((a, b) => a - b);
      } else {
        this.files[name] = {
          pubDate,
          modDate: null,
          modified: dates,
        };
      }
    });
  }

  writeTo(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.files, null, 2));
  }
}

const gatherModDates = (files, collection, dir) => {
  walk.sync(dir, function(filename, stat) {
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

let mod = new Modified();
mod.gather("src/content/garden");
mod.gather("src/content/blog");

process.exit();

let files = {};
// gatherModDates(files, "", "./content");
gatherModDates(files, "./src/content/garden");
gatherModDates(files, "./src/content/blog");
console.log(files);

// const out = "src/modified.json";
// fs.writeFileSync(out, JSON.stringify(modified, null, 2));
// console.log("modified times written to", out);
