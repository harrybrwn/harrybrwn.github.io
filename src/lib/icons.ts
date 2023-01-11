import path from "path";
import mappings from "../icons.json";

export interface IconDesc {
  alt: string;
  title: string;
  href: string;
  src?: string;
  exclude?: boolean;
}

export const getIcons = async (): Promise<Array<IconDesc>> => {
  let icons = [];
  let iconImports: { [key: string]: string } = {};
  let iconList = await import.meta.glob("../img/88x31/*.{gif,png}");
  for (const [key, fetchIcon] of Object.entries(iconList)) {
    let icon: any = await fetchIcon();
    iconImports[path.basename(key)] = icon.default;
  }
  for (const [key, obj] of Object.entries(
    mappings as { [key: string]: IconDesc }
  )) {
    if (obj.href === "" || obj.exclude === true) {
      continue;
    }
    obj.src = iconImports[key];
    if (obj.src) {
      icons.push(obj);
    }
  }
  return icons;
};
