import { spawnSync } from "child_process";

export const gitHead = () => {
  const cmd = spawnSync("git", ["--no-pager", "rev-parse", "HEAD"]);
  if (!cmd.stdout) return "development";
  return cmd.stdout.toString().trim();
};

export const HEAD_SHA = gitHead();
