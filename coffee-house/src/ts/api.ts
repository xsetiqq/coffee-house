import { FavoritesResponse,  ProductsResponse } from "./types";
import type { ConfirmOrderRequest, ConfirmOrderResponse, LoginRequest, LoginResponse, ProductByIdResponse, RegisterRequest, RegisterResponse } from "./types";

const BASE = "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  
  const text = await res.text();

  
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  
  if (!res.ok) {
    const message =
      (data as Record<string, unknown>)?.["error"]?.toString() ||
      (data as Record<string, unknown>)?.["message"]?.toString() ||
      `Error ${res.status}`;

    const err = new Error(message);
    (err as unknown as { status: number }).status = res.status;
    throw err;
  }

  
  return data as T;
}

export function getFavorites(): Promise<FavoritesResponse> {
  return http("/products/favorites");
}

export function getProducts(): Promise<ProductsResponse> {
  return http("/products");
}
export function getProductById(id: number): Promise<ProductByIdResponse> {
  return http(`/products/${id}`);
}

export  function isLogged(): boolean {
  return !!localStorage.getItem("authToken");
}


export function getCartCount(): number {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return 0;
    const list = JSON.parse(raw) as Array<{ count?: number }>;
    return list.reduce((acc, it) => acc + (it.count ?? 0), 0);
  } catch {
    return 0;
  }
}


export function registerUser(body: RegisterRequest): Promise<RegisterResponse> {
  return http<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function confirmOrder(
  body: ConfirmOrderRequest
): Promise<ConfirmOrderResponse> {
  return http<ConfirmOrderResponse>("/orders/confirm", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
export function loginUser(body: LoginRequest): Promise<LoginResponse> {
  return http<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
} 