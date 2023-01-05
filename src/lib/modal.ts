export class Modal extends HTMLElement {
  hidden: boolean;

  constructor() {
    super();
    this.hidden = this.dataset.hidden === "false" ? false : true;

    const closeModal = (e: KeyboardEvent) => {
      if (this.hidden) return;
      if ((e.key || e.code) === "Escape") {
        this.style.display = "none";
        this.hidden = true;
        e.preventDefault();
      }
    };

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
