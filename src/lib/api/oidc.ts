import { load_pkce, delete_pkce } from "./pkce";

export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface LoginRequest {
  password?: string;
  email?: string;
  username?: string;
  login_challenge?: string | null;
}

export interface RedirectTarget {
  redirect_to: string;
}

export const login = async (req: LoginRequest): Promise<RedirectTarget> => {
  return fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  }).then(async (res: Response) => {
    if (!res.ok) {
      try {
        const message = await res.json();
        return Promise.reject(new Error(message.message));
      } catch (e) {
        return Promise.reject(new Error(res.statusText));
      }
    }
    return res.json();
  });
};

export const consent = async (challenge: string): Promise<RedirectTarget> => {
  return fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ consent_challenge: challenge }),
  }).then((res: Response) => res.json());
};

export const getOIDCToken = (
  code: string,
  oidc_url: string,
  clientId: string
) => {
  let pkce = load_pkce();
  if (pkce == null) {
    return Promise.reject(new Error("failed to load pkce state"));
  }
  let u = new URL("/oauth2/token", oidc_url);
  let req = {
    code: code,
    grant_type: "authorization_code",
    client_id: clientId,
    code_verifier: pkce.verifier,
  };
  return (
    fetch(u.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(req),
    })
      // parse the token and handle errors
      .then(async (res: Response) => {
        if (!res.ok) {
          try {
            const message = await res.json();
            return Promise.reject(new Error(message.error_description));
          } catch (e) {
            return Promise.reject(new Error(res.statusText));
          }
        }
        return res.json();
      })
      // Save token to localStorage and return it
      .then((token: OAuth2Token) => {
        let raw = JSON.stringify(token);
        localStorage.setItem("oidc_token", raw);
        delete_pkce();
        return token;
      })
  );
};
