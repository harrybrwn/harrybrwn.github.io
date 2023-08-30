export function findFaviconType(icon?: string) {
  let iconType = "image/x-icon";
  if (icon === undefined) {
    return iconType;
  }
  if (icon.endsWith(".svg")) {
    iconType = "image/svg+xml";
  }
  return iconType;
}
