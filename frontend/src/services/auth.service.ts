import api from "../lib/axios";
import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
} from "../types/auth.types";

export const AuthService = {
  register(data: RegisterPayload) {
    return api.post<AuthResponse>("/auth/register", data);
  },

  login(data: LoginPayload) {
    return api.post<AuthResponse>("/auth/login", data);
  },

  logout() {
    return api.post("/auth/logout");
  },

  me() {
    return api.get<AuthResponse>("/auth/me");
  },
};

export default AuthService;
