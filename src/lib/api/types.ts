export interface LoginRequest {
  password?: string;
  email?: string;
  username?: string;
  login_challenge?: string | null;
}
