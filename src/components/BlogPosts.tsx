import type { Component } from "solid-js";
import type { Frontmatter } from "~/lib/blog";

export interface Post {
  url?: string;
  frontmatter: Frontmatter;
}

export interface Props {
  posts: Post[];
}

const BlogPosts: Component<Props> = (props) => {
  return (
    <ul>
      {props.posts.map(({ frontmatter: fm, url }) => (
        <li id={fm.slug}>
          <time datetime={fm.pubDate}>
            {new Date(fm.pubDate).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>{" "}
          <a href={url}>{fm.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default BlogPosts;
