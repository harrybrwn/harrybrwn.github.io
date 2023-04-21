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
