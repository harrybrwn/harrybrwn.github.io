// https://www.youtube.com/watch?v=HSoRtowmOEY

import {
  Component,
  JSX,
  Show,
  createSignal,
  createEffect,
  onCleanup,
} from "solid-js";
import "./Modal.module.css";

export interface ModalProps {
  open?: boolean;
  children?: JSX.Element;
  heading?: string;
  className?: string;
  onOpen?: () => void;
}

type Ref = HTMLElement | undefined;

export const Modal: Component<ModalProps> = (props) => {
  const [open, setOpen] = createSignal(props.open || false);
  let modal: Ref;

  createEffect(() => {
    const originalFucused = document.activeElement as HTMLElement;
    if (open()) {
      if (props.onOpen) props.onOpen();
      if (!modal) return;
      const focusable = modal.querySelectorAll(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      const firstEl = focusable?.[0] as HTMLElement;
      const lastEl = focusable?.[focusable.length - 1] as HTMLElement;

      // traps tab focus inside the modal. also handles escape key
      const focusTrap = (e: KeyboardEvent) => {
        const { key, code, shiftKey } = e;
        if ((key || code) === "Escape") {
          return setOpen(false);
        } else if ((key || code) !== "Tab") {
          return;
        }
        if (shiftKey) {
          if (document.activeElement === firstEl) {
            lastEl?.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === lastEl) {
          firstEl?.focus();
          e.preventDefault();
        }
      };

      document.addEventListener("keydown", focusTrap);
      (focusable?.[0] as HTMLElement).focus();
      onCleanup(() => {
        originalFucused.focus();
        document.removeEventListener("keydown", focusTrap);
      });
    }
  });

  return (
    <Show
      when={open()}
      fallback={() => <button onClick={() => setOpen(!open())}>Open</button>}
    >
      <div
        role="presentation"
        class="modal-backdrop"
        onClick={() => setOpen(false)}
      />
      <section role="dialog" class="modal" ref={modal}>
        {props.heading && (
          <header>
            <h2>{props.heading}</h2>
            <button
              aria-label="Close Dialog"
              class="modal-close"
              onClick={() => setOpen(false)}
            >
              &#x2715;
            </button>
          </header>
        )}
        <div class="modal-body">{props.children}</div>
      </section>
    </Show>
  );
};
