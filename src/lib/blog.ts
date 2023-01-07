import type { MarkdownInstance } from "astro";

export interface Frontmatter extends Record<string, any> {
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  draft?: boolean;
  slug?: string;
}

export interface GetPostOptions {
  drafts: boolean;
  url?: string;
}

const getPosts = async (opts?: GetPostOptions) => {
  const posts = await import.meta.glob<MarkdownInstance<Frontmatter>>(
    "../../content/**/*.md"
  );
  return preparePosts(
    await Promise.all(Object.values(posts).map((p) => p())),
    opts
  );
};

export const preparePosts = (
  posts: MarkdownInstance<Frontmatter>[],
  opts?: GetPostOptions
) => {
  if (!opts) {
    opts = { drafts: import.meta.env.DEV };
  }
  const { drafts } = opts;
  return posts
    .filter(({ frontmatter }) => drafts || !frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).valueOf() -
        new Date(a.frontmatter.pubDate).valueOf()
    )
    .map((p) => {
      if (!p.frontmatter.title || p.frontmatter.title.length === 0) {
        throw new Error("markdown post must have a title in the frontmatter");
      }
      if (!p.frontmatter.pubDate || p.frontmatter.pubDate.length === 0) {
        throw new Error(
          "markdown post must have a publish date in the frontmatter"
        );
      }
      p.frontmatter.pubDate = new Date(p.frontmatter.pubDate).toISOString();
      return p;
    });
};
