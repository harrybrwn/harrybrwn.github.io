import fs from "fs";

const icons = JSON.parse(fs.readFileSync("src/icons.json").toString());

for (const [name, meta] of Object.entries(icons)) {
  if (meta.exclude) {
    continue;
  }
  console.log(`"${name}": {
  alt: "${meta.alt}",
  title: "${meta.title}",
  href: "${meta.href}",
  src: (await Astro.glob("../img/88x31/${name}"))[0].default
},`);
}
