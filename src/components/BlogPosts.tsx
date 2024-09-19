import type { Component } from "solid-js";
import type { Frontmatter } from "~/lib/blog";

export interface Post {
  url?: string;
  frontmatter: Frontmatter;
}

export interface Props {
  posts: Post[];
}

const format = (date: string) =>
  new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const BlogPosts: Component<Props> = (props) => {
  return (
    <table>
      {props.posts.map(({ frontmatter: fm, url }) => (
        <tr>
          <td>
            <time datetime={fm.pubDate}>{format(fm.pubDate)}</time>
          </td>
          <td>
            <a href={url || ''}>{fm.title}</a>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default BlogPosts;
