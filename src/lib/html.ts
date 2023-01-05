export interface HTMLAttributes {
  id?: string | undefined | null;
  class?: string | undefined | null;
  title?: string | undefined | null;
}

export type HTMLAttributeReferrerPolicy =
  | ""
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

export type HTMLAttributeAnchorTarget =
  | "_self"
  | "_blank"
  | "_parent"
  | "_top"
  | (string & {});

export interface AnchorHTMLAttributes extends HTMLAttributes {
  download?: string | boolean | undefined | null;
  href?: string | URL | undefined | null;
  hreflang?: string | undefined | null;
  media?: string | undefined | null;
  ping?: string | undefined | null;
  rel?: string | undefined | null;
  target?: HTMLAttributeAnchorTarget | undefined | null;
  type?: string | undefined | null;
  referrerpolicy?: HTMLAttributeReferrerPolicy | undefined | null;
}
