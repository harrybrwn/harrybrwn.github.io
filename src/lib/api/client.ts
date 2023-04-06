import type { LoginRequest } from "./types";
import { storeToken, type Token } from "./token";

export class Client {
  url: URL;
  oidcUrl: URL;
  oidcClientId?: string;

  constructor(url: URL, oidcUrl?: URL | undefined, oidcClientId?: string) {
    this.url = url;
    this.oidcUrl = oidcUrl || new URL(import.meta.env.PUBLIC_OIDC_URL);
    this.oidcClientId = oidcClientId;
  }

  async login(req: LoginRequest) {
    return fetch(new URL("/api/login", this.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      credentials: "include",
    }).then(handleResponse);
  }

  async token(req: LoginRequest, cookie?: boolean | undefined) {
    let u = new URL("/api/token", this.url);
    if (cookie) u.searchParams.set("cookie", "true");
    return fetch(u, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      credentials: "include",
    })
      .then(handleResponse)
      .then((blob: any) => {
        let tok: Token = {
          token: blob.token,
          expires: blob.expires,
          refresh: blob.refresh_token,
          type: blob.token_type,
        };
        storeToken(tok);
        return tok;
      });
  }
}

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    try {
      const message = await res.json();
      return Promise.reject(new Error(message.message));
    } catch (e) {
      return Promise.reject(new Error(res.statusText));
    }
  }
  return res.json();
};
