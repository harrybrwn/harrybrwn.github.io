import path from "path";
import fs from "fs";
import type { MarkdownInstance } from "astro";
import GithubSlugger, { slug as toSlugBase } from "github-slugger";
import modified from "~/modified.json";

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

export type markdown = MarkdownInstance<Frontmatter>;

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

const getPubDate = (p: markdown) => {
  // Explicit pubDate takes highest precedence.
  if (p.frontmatter.pubDate) {
    return new Date(p.frontmatter.pubDate);
  }

  // Find the markdown file in our prebuilt modified times json file. If its not
  // there then use the os file stat.
  let name = path.relative(process.cwd(), p.file);
  if (name in modified) {
    const dates = (modified as { [key: string]: string[] })[name];
    if (dates.length === 0) {
      return fs.statSync(p.file).mtime;
    }
    return new Date(dates[dates.length - 1]);
  } else {
    return fs.statSync(p.file).mtime;
  }
};

export interface GetPostOptions {
  /**
   * Option for including drafts in post output.
   */
  drafts?: boolean;
  /**
   * Include only blog posts.
   */
  blog?: boolean;
}

// TODO(harrybrwn) filter out files that are in .gitignore
const preparePosts = (posts: markdown[], opts?: GetPostOptions) => {
  if (!opts) {
    opts = { drafts: import.meta.env.DEV };
  }
  if (opts.drafts === undefined) opts.drafts = import.meta.env.DEV;
  const { drafts, blog } = opts;
  return (
    posts
      // If "include drafts" then include all, otherwise filter out all with
      // frontmatter that explicitly includes `draft: true`
      .filter(({ frontmatter: { draft } }) => drafts || draft !== true)
      // If "include blog posts" option is set to true then we only include blog
      // posts, if false then we exclude all blog posts. If the option is
      // `undefined` then we include all posts.
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
        p.frontmatter.pubDate = getPubDate(p).toISOString();
        return p;
      })
      .sort(
        (a, b) =>
          new Date(b.frontmatter.pubDate).valueOf() -
          new Date(a.frontmatter.pubDate).valueOf()
      )
  );
};

// Used to cache all the posts in an import glob.
let postsCache: Array<markdown>;

/**
 *
 * @param opts Various filtering options
 * @returns an array of objects representing markdown files.
 */
export const getPosts = async (opts?: GetPostOptions) => {
  if (!postsCache) {
    const posts = await import.meta.glob<markdown>("../../content/**/*.md");
    postsCache = await Promise.all(Object.values(posts).map((p) => p()));
  }
  return preparePosts(postsCache, opts);
};

/**
 *
 * @param post A MarkdownInstance that contains all content and metadata.
 * @param keepCase If false, all slugs will be lowercase.
 * @param slugger If a slugger is passed, the function will use a GithubSlugger
 *                to maintain a namespace for all url slugs.
 * @returns A string of the slug that should be used in the url of the post.
 */
export const slug = (
  post: markdown,
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
