// TODO: https://web.dev/building-a-theme-switch-component/

const DEFAULT_TOGGLE_ID = "theme-toggle";

const getToggle = (id?: string): HTMLElement | null => {
  if (!id) {
    id = DEFAULT_TOGGLE_ID;
  }
  let btn = document.getElementById(id);
  return btn;
};

const loadTheme = (key: string): Theme => {
  // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  // return prefersDark.matches ? Theme.Dark : Theme.Light;

  let res = localStorage.getItem(key);
  if (res == null) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.Dark
      : Theme.Light;
  }
  return parseInt(res);
};

export enum Theme {
  Dark = 0,
  Light = 1,
}

const asStr = (t: Theme) => (t === Theme.Dark ? "dark" : "light");

export class ThemeManager {
  theme: Theme;
  themeToggle: HTMLInputElement;

  constructor(toggleId?: string) {
    this.theme = window.theme === undefined ? loadTheme("theme") : window.theme;
    document.firstElementChild?.setAttribute("data-theme", asStr(this.theme));
    let toggle = getToggle(toggleId);
    if (toggle == null) {
      console.error("could not get theme toggle button");
    }
    this.themeToggle = toggle as HTMLInputElement;
    if (this.themeToggle != null && "checked" in this.themeToggle) {
      this.themeToggle.checked = this.theme === Theme.Light;
    }
  }

  toggle() {
    this.set(this.theme === Theme.Dark ? Theme.Light : Theme.Dark);
  }

  set(theme: Theme) {
    if (this.theme === theme) return;
    document.firstElementChild?.setAttribute("data-theme", asStr(theme));
    localStorage.setItem("theme", theme.toLocaleString());
    if (this.themeToggle)
      this.themeToggle.checked = theme === Theme.Dark ? false : true;
    this.theme = theme;
  }

  onChange(fn: (ev: Event) => void) {
    this.themeToggle.addEventListener("change", fn);
  }
}
