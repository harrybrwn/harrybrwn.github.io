import type { Component } from "solid-js";
import { type CollectionEntry } from "astro:content";

export interface Post {
  url: string;
  entry: CollectionEntry<'blog' | 'garden'>;
}

export interface Props {
  posts: Post[];
}

const format = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const BlogPosts: Component<Props> = (props) => {
  return (
    <table>
      {props.posts.map(({ entry: { data }, url }) => (
        <tr>
          <td>
            <time datetime={data.pubDate?.toISOString()}>{format(data.pubDate || "")}</time>
          </td>
          <td>
            <a href={url}>{data.title}</a>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default BlogPosts;
