export class Modal extends HTMLElement {
  hidden: boolean;

  constructor() {
    super();
    this.hidden = this.dataset.hidden === "false" ? false : true;

    const closeModal = (e: KeyboardEvent) => {
      if (this.hidden) return;
      if ((e.key || e.code) === "Escape") {
        e.preventDefault();
        this.style.setProperty("--display", "none");
        this.hidden = true;
      }
    };

    document.addEventListener("click", (ev: MouseEvent) => {
      if (this.hidden) {
        console.log("modal is hidden, skipping...");
        return;
      }
      const clicked = ev.target as HTMLElement;
      if (clicked.nodeName === "BUTTON") return;
      for (
        let el: HTMLElement | null = clicked;
        el != null && el != document.body;
        el = el.parentElement
      ) {
        if (el == this) return;
      }
      this.toggle();
    });
    document.addEventListener("keydown", closeModal);

    if (this.dataset.btnid) {
      const btnid = this.dataset.btnid;
      const btn = document.getElementById(btnid);
      btn?.addEventListener("click", (ev: MouseEvent) => {
        this.toggle();
      });
    }
  }

  toggle() {
    this.hidden = !this.hidden;
    this.style.setProperty("--display", this.hidden ? "none" : "block");
  }
}
