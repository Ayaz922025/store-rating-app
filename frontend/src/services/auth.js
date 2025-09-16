// frontend/src/services/auth.js
import api from "./api";
import jwtDecode from "jwt-decode";

/**
 * login: calls backend /auth/login, stores token and returns decoded payload
 */
export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data.token;
  localStorage.setItem("token", token);
  return jwtDecode(token);
}

/**
 * signup: calls backend /auth/signup, then auto-logs-in the new user and returns decoded payload
 */
export async function signup({ name, email, address, password }) {
  await api.post("/auth/signup", { name, email, address, password, role: "user" });
  // after signup, call login to receive token
  return await login({ email, password });
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
