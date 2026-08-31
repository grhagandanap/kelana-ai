import { RegisterPayload, LoginPayload, AuthResponse, User } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_BASE = `${API_URL}/auth`;

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function postJSON<T>(url: string, payload: unknown, fallbackErrorMsg: string): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    let message = fallbackErrorMsg;
    if (typeof err?.detail === "string") message = err.detail;
    else if (Array.isArray(err?.detail)) {
      message = err.detail.map((e: { loc: string[]; msg: string }) => `${e.loc.at(-1)}: ${e.msg}`).join(", ");
    }
    throw new Error(message);
  }

  return res.json();
}

export function registerUser(payload: RegisterPayload) {
  return postJSON(`${AUTH_BASE}/register`, payload, "Registration failed");
}

export function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return postJSON<AuthResponse>(`${AUTH_BASE}/login`, payload, "Login failed");
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { ...authHeaders() },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
  return res.json();
}

export function logout() {
  localStorage.removeItem("access_token");
}