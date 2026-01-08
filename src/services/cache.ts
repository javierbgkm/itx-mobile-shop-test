const CACHE_PREFIX = 'itx-cache:';
const HOUR_IN_MS = 1000 * 60 * 60;

type CacheRecord<T> = {
  timestamp: number;
  data: T;
};

const getStorage = () => {
  try {
    return window.localStorage;
  } catch (error) {
    console.warn('LocalStorage no disponible', error);
    return null;
  }
};

export const cacheTtl = HOUR_IN_MS;

export function readCache<T>(key: string, ttl = cacheTtl): T | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(`${CACHE_PREFIX}${key}`);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CacheRecord<T>;
    if (Date.now() - parsed.timestamp > ttl) {
      storage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return parsed.data;
  } catch (error) {
    storage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const record: CacheRecord<T> = {
    timestamp: Date.now(),
    data
  };

  storage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(record));
}

export function clearCacheEntry(key: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(`${CACHE_PREFIX}${key}`);
}

export async function fetchWithCache<T>(key: string, loader: () => Promise<T>, ttl = cacheTtl): Promise<T> {
  const cached = readCache<T>(key, ttl);
  if (cached) {
    return cached;
  }

  const fresh = await loader();
  writeCache(key, fresh);
  return fresh;
}
