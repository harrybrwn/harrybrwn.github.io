import { spawnSync } from "child_process";

export const gitHead = () => {
  const cmd = spawnSync("git", ["--no-pager", "rev-parse", "HEAD"]);
  return cmd.stdout.toString().trim();
};
