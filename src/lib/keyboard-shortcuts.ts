import type { Modal } from "./modal";

export type Listener = (e: KeyboardEvent) => void;

export const listener = (themer: () => void, help: Modal | null): Listener => {
  return (ev: KeyboardEvent) => {
    const e = ev.target as HTMLElement;
    if (e.tagName == "INPUT" || e.tagName == "TEXTAREA") {
      return;
    }
    switch (ev.key || ev.code) {
      case "t":
        ev.preventDefault();
        themer();
        break;
      case "l":
        // TODO make this into a modal instead of a redirect.
        if (!ev.ctrlKey && !ev.shiftKey) {
          ev.preventDefault();
          window.location.href = "/login/";
        }
        break;
      case "?":
        ev.preventDefault();
        if (help) help.toggle();
        break;
    }
  };
};
