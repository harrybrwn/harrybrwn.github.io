import type { Component } from "solid-js";

interface Frontmatter extends Record<string, any> {
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  draft: boolean;
  slug?: string;
  url?: string;
}

export interface Props {
  posts: Frontmatter[];
}

const BlogPosts: Component<Props> = (props) => {
  return (
    <ul>
      {props.posts.map((post) => (
        <li id={post.slug}>
          <time datetime={post.pubDate}>
            {new Date(post.pubDate).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>{" "}
          <a href={post.url}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default BlogPosts;
