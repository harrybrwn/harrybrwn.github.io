import path from "path";
import mappings from "../iconMappings.json";

export interface IconDesc {
  alt: string;
  title: string;
  href: string;
  src?: string;
}

export const getIcons = async (): Promise<Array<IconDesc>> => {
  let icons = [];
  let iconImports: { [key: string]: string } = {};
  let iconList = await import.meta.glob("../img/88x31/*.gif");
  for (const [key, fetchIcon] of Object.entries(iconList)) {
    let icon: any = await fetchIcon();
    iconImports[path.basename(key)] = icon.default;
  }
  for (const [key, obj] of Object.entries(
    mappings as { [key: string]: IconDesc }
  )) {
    if (obj.href === "") {
      continue;
    }
    obj.src = iconImports[key];
    if (obj.src) {
      icons.push(obj);
    }
  }
  return icons;
};
