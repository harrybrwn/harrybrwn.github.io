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

export const bsky = {
  handle: "hrry.me",
  did: "did:plc:kzvsijt4365vidgqv7o6wksi",
};

export const links = {
  github: "https://github.com/harrybrwn",
  linkedin: "https://www.linkedin.com/in/harrybrwn/",
  worldOfText: "https://www.yourworldoftext.com/~harrybrwn/",
  mastodon: `https://${mastodon.instance}/@${mastodon.username}`,
  bsky: `https://bsky.app/profile/${bsky.did}`,
};

export const git = {
  url: new URL(pkg.repository.url),
  repo: "harrybrwn/harrybrwn.github.io",
  branch: "main",
};

export const gardenBasePath = "/garden";
