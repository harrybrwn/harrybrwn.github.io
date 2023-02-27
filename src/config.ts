import pkg from "../package.json";

export const SITE_TITLE = "Harry Brown";
export const SITE_DESCRIPTION =
  "The home page of a humble backend software engineer.";

export const previewImage = "https://harrybrwn.com/static/img/goofy.jpg";
export const twitterUser = "harryb998";

export const mastodon = {
  username: "harrybrwn",
  instance: "hachyderm.io",
};

export const links = {
  github: "https://github.com/harrybrwn",
  linkedin: "https://www.linkedin.com/in/harrison-brown-88823b185/",
  worldOfText: "https://www.yourworldoftext.com/~harrybrwn/",
  mastodon: `https://${mastodon.instance}/@${mastodon.username}`,
};

export const git = {
  url: new URL(pkg.repository.url),
  repo: "harrybrwn/harrybrwn.github.io",
  branch: "main",
};

export const gardenBasePath = "/garden";
