import {RegisterPayload, LoginPayload, AuthResponse} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function registerUser(payload: RegisterPayload) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail ?? "Registration failed");
    }
  
    return res.json();
  }
  
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail ?? "Login failed");
    }
  
    return res.json();
  }