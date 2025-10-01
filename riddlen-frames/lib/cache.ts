import { unstable_cache } from 'next/cache';

/**
 * Cache configuration for different data types
 */
export const CACHE_CONFIG = {
  // Riddle data changes infrequently
  RIDDLE_DATA: {
    key: 'riddle-data',
    revalidate: 60, // 1 minute
  },
  // Leaderboard updates frequently but can tolerate slight delay
  LEADERBOARD: {
    key: 'leaderboard',
    revalidate: 30, // 30 seconds
  },
  // User profile can be cached longer
  USER_PROFILE: {
    key: 'user-profile',
    revalidate: 120, // 2 minutes
  },
  // Contract data is relatively static
  CONTRACT_INFO: {
    key: 'contract-info',
    revalidate: 300, // 5 minutes
  },
};

/**
 * Create a cached version of a blockchain data fetcher
 */
export function createCachedFetcher<T>(
  fetcher: () => Promise<T>,
  cacheKey: string,
  revalidateSeconds: number
) {
  return unstable_cache(
    async () => {
      try {
        const startTime = Date.now();
        const result = await fetcher();
        const duration = Date.now() - startTime;

        // Log performance in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Cache] ${cacheKey}: ${duration}ms`);
        }

        return result;
      } catch (error) {
        console.error(`[Cache Error] ${cacheKey}:`, error);
        throw error;
      }
    },
    [cacheKey],
    {
      revalidate: revalidateSeconds,
      tags: [cacheKey],
    }
  );
}

/**
 * In-memory cache for very short-lived data (within same request)
 */
class MemoryCache {
  private cache = new Map<string, { data: any; expiresAt: number }>();

  set(key: string, data: any, ttlMs: number = 5000) {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const memoryCache = new MemoryCache();

/**
 * Parallel data fetching with caching
 */
export async function fetchParallel<T extends Record<string, any>>(
  fetchers: { [K in keyof T]: () => Promise<T[K]> }
): Promise<T> {
  const keys = Object.keys(fetchers) as (keyof T)[];
  const promises = keys.map(key => fetchers[key]());
  const results = await Promise.all(promises);

  return keys.reduce((acc, key, index) => {
    acc[key] = results[index];
    return acc;
  }, {} as T);
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private metrics: Array<{ name: string; duration: number; timestamp: number }> = [];

  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;

      this.metrics.push({
        name,
        duration,
        timestamp: Date.now(),
      });

      if (duration > 500) {
        console.warn(`[Performance] Slow operation: ${name} took ${duration}ms`);
      }

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.metrics.push({
        name: `${name} (error)`,
        duration,
        timestamp: Date.now(),
      });
      throw error;
    }
  }

  getMetrics() {
    return this.metrics;
  }

  getAverageDuration(name: string): number {
    const relevant = this.metrics.filter(m => m.name === name);
    if (relevant.length === 0) return 0;
    return relevant.reduce((sum, m) => sum + m.duration, 0) / relevant.length;
  }

  clear() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
