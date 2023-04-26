export function extname(p: string) {
  let ext = "";
  let dotIx = p.lastIndexOf(".");
  if (dotIx != -1) {
    ext = p.slice(dotIx, p.length);
  }
  return ext;
}
