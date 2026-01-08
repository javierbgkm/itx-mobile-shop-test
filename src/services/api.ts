import type { CartResponse, ProductDetail, ProductSummary } from '../types/product';
import { fetchWithCache } from './cache';

const API_BASE_URL = 'https://itx-frontend-test.onrender.com/api';

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error('No se ha podido completar la petición.');
  }

  return (await response.json()) as T;
}

export function fetchProducts(): Promise<ProductSummary[]> {
  return fetchWithCache<ProductSummary[]>('products', () => request<ProductSummary[]>(`${API_BASE_URL}/product`));
}

export function fetchProductDetail(id: string): Promise<ProductDetail> {
  return fetchWithCache<ProductDetail>(`product:${id}`, () => request<ProductDetail>(`${API_BASE_URL}/product/${id}`));
}

export async function addProductToCart(payload: { id: string; colorCode: number; storageCode: number }): Promise<CartResponse> {
  return request<CartResponse>(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}
