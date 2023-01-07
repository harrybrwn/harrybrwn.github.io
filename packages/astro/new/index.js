import path from "path";
import fs from "fs";
import prompts from "prompts";
import { slug } from "github-slugger";

const contentDir = "content";

const newBlog = async () => {
  let { title, description, tags, layout, draft } = await prompts([
    {
      type: "text",
      name: "title",
      message: "Title you post.",
    },
    {
      type: "text",
      name: "description",
      message: "Describe you post.",
    },
    {
      type: "select",
      name: "layout",
      message: "What layout should I use?",
      initial: 0,
      choices: [
        {
          title: "Blog Post",
          description: "~/layouts/BlogPost.astro",
          value: "~/layouts/BlogPost.astro",
        },
        {
          title: "Base",
          description: "~/layouts/Base.astro",
          value: "~/layouts/Base.astro",
        },
      ],
    },
    {
      type: "list",
      name: "tags",
      message: "Add tags. (comma separated)",
    },
    {
      type: "confirm",
      name: "draft",
      message: "Is this a rough draft?",
    },
  ]);
  // TODO implement a signal handler to cancel gracefully.
  if (draft === undefined) {
    throw new Error("draft is undefined");
  }
  title = title.trim();
  description = description.trim();

  const filename = path.join(contentDir, `${slug(title)}.md`);
  if (fs.existsSync(filename)) {
    throw new Error(`${filename} already exists`);
  }
  const now = new Date();
  const pubDate = now.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  let lines = [
    "---",
    `title: "${title}"`,
    `description: "${description}"`,
    `pubDate: ${pubDate}`,
    "tags:",
    ...tags.map((t) => (t ? `  - ${t}` : undefined)),
  ];
  lines.push(
    `draft: ${draft}`,
    `layout: "${layout}"`,
    "---",
    "",
    "## Hello World",
    ""
  );
  const content = lines.filter((l) => l !== undefined).join("\n");
  console.log(`Creating "${filename}"...`);
  fs.writeFileSync(filename, content);
};

(async () => {
  await newBlog();
})();
