export const TOKEN_KEY = "_token";
export const REFRESH_TOKEN_KEY = "_refresh";

export interface Token {
  token: string;
  expires: number;
  refresh: string;
  type: string;
}

export function storeToken(t: Token) {
  let refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (
    (refresh == null || refresh != t.refresh) &&
    t.refresh != null &&
    t.refresh.length > 0
  ) {
    localStorage.setItem(REFRESH_TOKEN_KEY, t.refresh);
  }
  // don't need to store the refresh token twice
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({
      token: t.token,
      expires: t.expires,
      type: t.type,
    })
  );
}
