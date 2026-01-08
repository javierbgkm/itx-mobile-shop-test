import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { addProductToCart, fetchProductDetail, fetchProducts } from './api';
import { fetchWithCache } from './cache';

vi.mock('./cache', () => ({
  fetchWithCache: vi.fn((key: string, loader: () => Promise<unknown>) => loader())
}));

const mockedFetchWithCache = fetchWithCache as unknown as Mock;
const globalAny = globalThis as typeof globalThis & { fetch: ReturnType<typeof vi.fn> };

const mockFetchResponse = <T,>(payload: T, ok = true) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(payload)
  } as Response);

describe('api service', () => {
  beforeEach(() => {
    mockedFetchWithCache.mockClear();
    globalAny.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('recupera el listado de productos utilizando caché', async () => {
    const payload = [{ id: '1' }];
    globalAny.fetch.mockImplementation(() => mockFetchResponse(payload));

    await expect(fetchProducts()).resolves.toEqual(payload);

    expect(mockedFetchWithCache).toHaveBeenCalledWith('products', expect.any(Function));
    expect(globalAny.fetch).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/product', undefined);
  });

  it('obtiene la información de un producto y la cachea', async () => {
    const payload = { id: 'abc' };
    globalAny.fetch.mockImplementation(() => mockFetchResponse(payload));

    await expect(fetchProductDetail('abc')).resolves.toEqual(payload);

    expect(mockedFetchWithCache).toHaveBeenCalledWith('product:abc', expect.any(Function));
    expect(globalAny.fetch).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/product/abc', undefined);
  });

  it('envía la información necesaria para añadir un producto al carrito', async () => {
    globalAny.fetch.mockImplementation(() => mockFetchResponse({ count: 2 }));

    await expect(addProductToCart({ id: 'abc', colorCode: 1, storageCode: 2 })).resolves.toEqual({ count: 2 });

    expect(globalAny.fetch).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'abc', colorCode: 1, storageCode: 2 })
    });
  });

  it('lanza un error cuando la petición no tiene éxito', async () => {
    globalAny.fetch.mockImplementation(() => mockFetchResponse({}, false));

    await expect(fetchProductDetail('fail')).rejects.toThrow(/No se ha podido completar la petici/i);
  });
});
