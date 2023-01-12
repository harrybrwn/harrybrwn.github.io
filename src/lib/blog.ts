import path from "path";
import fs from "fs";
import type { MarkdownInstance } from "astro";
import GithubSlugger, { slug as toSlugBase } from "github-slugger";
// import modified from "~/modified.json";
import { spawnSync } from "child_process";
import walk from "walkdir";

export interface Frontmatter extends Record<string, any> {
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  /**
   * Mark the file as a draft and only publish it if we explicity include drafts.
   */
  draft?: boolean;
  /**
   * Tag the file as a blog post with `blog: true`.
   */
  blog?: boolean;
  /**
   * For blog posts only, use a different slug in the blog post's url.
   */
  slug?: string;
  /**
   * Astro layout used to render the markdown file.
   */
  layout?: string;
}

export const slug = (
  post: MarkdownInstance<Frontmatter>,
  keepCase?: boolean,
  slugger?: GithubSlugger
) => {
  const ext = path.extname(post.file);
  const name = path.basename(post.file).replace(ext, "");
  let title;
  if (post.frontmatter.blog) {
    title = post.frontmatter.slug || post.frontmatter.title || name;
  } else {
    if (!post.frontmatter.title) post.frontmatter.title = name;
    title = post.frontmatter.title;
  }
  if (slugger) {
    return slugger.slug(title, keepCase);
  } else {
    return toSlugBase(title, keepCase);
  }
};

type Dates = Record<string, Date[]>;

const gatherModDates = (dir: string) => {
  let files: Dates = {};
  walk.sync(dir, function (filename: string, stat: fs.Stats) {
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

const validate = (frontmatter: Frontmatter) => {
  if (!frontmatter.title || frontmatter.title.length === 0) {
    throw new Error("markdown post must have a title in the frontmatter");
  }
  if (!frontmatter.pubDate || frontmatter.pubDate.length === 0) {
    throw new Error(
      "markdown post must have a publish date in the frontmatter"
    );
  }
};

export interface GetPostOptions {
  drafts?: boolean;
  blog?: boolean;
}

// TODO(harrybrwn) filter out files that are in .gitignore
const preparePosts = (
  posts: MarkdownInstance<Frontmatter>[],
  opts?: GetPostOptions
) => {
  if (!opts) {
    opts = { drafts: import.meta.env.DEV };
  }
  if (opts.drafts === undefined) opts.drafts = false;
  const { drafts, blog } = opts;
  return posts
    .filter(({ frontmatter: { draft } }) => drafts || draft !== true)
    .filter(({ frontmatter }) => {
      if (blog === true) {
        return frontmatter.blog;
      } else if (blog === false) {
        return !frontmatter.blog;
      }
      return true;
    })
    .map((p) => {
      if (p.frontmatter.blog) validate(p.frontmatter);
      if (p.frontmatter.pubDate) {
        p.frontmatter.pubDate = new Date(p.frontmatter.pubDate).toISOString();
      } else {
        let name = path.relative(process.cwd(), p.file);
        if (name in modified) {
          const dates = modified[name];
          const d = dates[dates.length - 1];
          p.frontmatter.pubDate = d.toISOString();
        } else {
          let stat = fs.statSync(p.file);
          p.frontmatter.pubDate = stat.mtime.toISOString();
        }
      }
      return p;
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).valueOf() -
        new Date(a.frontmatter.pubDate).valueOf()
    );
};

let postsCache: Array<MarkdownInstance<Frontmatter>>;

/**
 *
 * @param opts Various filtering options
 * @returns an array of objects representing markdown files.
 */
export const getPosts = async (opts?: GetPostOptions) => {
  if (!postsCache) {
    const posts = await import.meta.glob<MarkdownInstance<Frontmatter>>(
      "../../content/**/*.md"
    );
    postsCache = await Promise.all(Object.values(posts).map((p) => p()));
  }
  return preparePosts(postsCache, opts);
};
