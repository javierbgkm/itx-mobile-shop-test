import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithCache, readCache, writeCache } from './cache';

const TEST_KEY = 'spec';

beforeEach(() => {
  window.localStorage.clear();
  vi.useRealTimers();
});

describe('cache helpers', () => {
  it('devuelve la información si la caché sigue siendo válida', () => {
    const payload = { foo: 'bar' };
    writeCache(TEST_KEY, payload);

    expect(readCache<typeof payload>(TEST_KEY)).toEqual(payload);
  });

  it('invalida la caché tras pasar el intervalo de tiempo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    writeCache(TEST_KEY, { foo: 'bar' });

    vi.setSystemTime(2_000);

    expect(readCache(TEST_KEY, 1_000)).toBeNull();
  });

  it('reutiliza el payload sin el loading', async () => {
    const loader = vi.fn().mockResolvedValue({ message: 'cached' });
    const first = await fetchWithCache(TEST_KEY, loader, 60_000);

    expect(first).toEqual({ message: 'cached' });
    expect(loader).toHaveBeenCalledTimes(1);

    const second = await fetchWithCache(TEST_KEY, () => Promise.reject(new Error('Should not run')), 60_000);
    expect(second).toEqual(first);
  });
});
