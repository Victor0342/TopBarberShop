type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export const rateLimit = (key: string, config: RateLimitConfig) => {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { ok: true, remaining: config.limit - 1 };
  }

  if (entry.count >= config.limit) {
    return { ok: false, remaining: 0 };
  }

  entry.count += 1;
  store.set(key, entry);
  return { ok: true, remaining: config.limit - entry.count };
};
