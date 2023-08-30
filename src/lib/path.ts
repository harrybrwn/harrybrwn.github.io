// All code in this file is stolen from nodejs.
// https://github.com/nodejs/node/blob/main/lib/path.js

export function _extname(p: string) {
  let ext = "";
  let dotIx = p.lastIndexOf(".");
  if (dotIx != -1) {
    ext = p.slice(dotIx, p.length);
  }
  return ext;
}

const CHAR_DOT = 0x2e,
  CHAR_FORWARD_SLASH = 0x2f,
  CHAR_BACKWARD_SLASH = 0x5c;

function isPathSeparator(code: number) {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
}

export function extname(path: string) {
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path.length - 1; i >= start; --i) {
    const code = path.charCodeAt(i);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (
    startDot === -1 ||
    end === -1 ||
    preDotState === 0 ||
    (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
  ) {
    return "";
  }
  return path.slice(startDot, end);
}

export function basename(path: string) {
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  for (let i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        start = i + 1;
        break;
      }
    } else if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
  }
  if (end === -1) return "";
  return path.slice(start, end);
}

export function normalize(path: string) {
  if (path.length === 0) return ".";
  const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
  const trailingSeparator =
    path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
  // Normalize the path
  //path = normalizeString(
  //  path,
  //  !isAbsolute,
  //  "/",
  //  (code: number) => code === CHAR_FORWARD_SLASH
  //);
  if (path.length === 0) {
    if (isAbsolute) return "/";
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) path += "/";
  return isAbsolute ? `/${path}` : path;
}

export function join(...args: string[]) {
  if (args.length === 0) return ".";
  let joined;
  for (let i = 0; i < args.length; ++i) {
    const arg = args[i];
    if (arg.length > 0) {
      if (joined === undefined) joined = arg;
      else joined += `/${arg}`;
    }
  }
  if (joined === undefined) return ".";
  return normalize(joined);
}

export default {
  join,
  normalize,
  basename,
  extname,
};
