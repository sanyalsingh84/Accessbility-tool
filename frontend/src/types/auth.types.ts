export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/* ---------- Request Payloads ---------- */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/* ---------- Responses ---------- */
export interface AuthResponse {
  user: AuthUser;
}
