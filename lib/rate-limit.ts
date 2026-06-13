const rateLimitCache = new Map<string, { count: number, resetAt: number }>()

export function rateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const current = rateLimitCache.get(identifier)

  if (!current) {
    rateLimitCache.set(identifier, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (now > current.resetAt) {
    rateLimitCache.set(identifier, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (current.count >= limit) {
    return false
  }

  current.count++
  return true
}

// Optional: clean up the cache periodically to prevent memory leaks in long-running processes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitCache.entries()) {
    if (now > value.resetAt) {
      rateLimitCache.delete(key)
    }
  }
}, 60000)
