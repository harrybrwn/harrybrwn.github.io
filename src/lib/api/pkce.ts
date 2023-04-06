export interface Pkce {
  verifier: string;
  challenge: string;
  state: string;
}

export const new_pkce = async (): Promise<Pkce> => {
  const verifierBuf = crypto.getRandomValues(new Uint8Array(96));
  const verifier = b64(verifierBuf); // this will have a length of 128

  const ascii = new Uint8Array(verifier.length);
  for (let i = 0; i < verifier.length; i++) ascii[i] = verifier.charCodeAt(i);

  const hash = await crypto.subtle.digest("SHA-256", ascii);
  return {
    verifier: verifier,
    challenge: b64(new Uint8Array(hash)),
    state: b64(crypto.getRandomValues(new Uint8Array(16))),
  };
};

export const save_pkce = (pkce: Pkce) => {
  localStorage.setItem("oidc_verifier", pkce.verifier);
  localStorage.setItem("oidc_challenge", pkce.challenge);
  localStorage.setItem("oidc_state", pkce.state);
};

export const delete_pkce = () => {
  localStorage.removeItem("oidc_verifier");
  localStorage.removeItem("oidc_challenge");
  localStorage.removeItem("oidc_state");
};

export const load_pkce = (): Pkce | null => {
  let v = localStorage.getItem("oidc_verifier");
  let c = localStorage.getItem("oidc_challenge");
  let s = localStorage.getItem("oidc_state");
  if (v == null || c == null || s == null) {
    console.warn("failed to load oidc state:", v, c, s);
    return null;
  }
  return {
    verifier: v,
    challenge: c,
    state: s,
  };
};

const b64 = (buf: Uint8Array) => {
  // https://tools.ietf.org/html/rfc4648#section-5
  return btoa(String.fromCharCode.apply(null, Array.from(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};
