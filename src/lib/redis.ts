import Redis from 'ioredis';

const redisClientFactory = () => {
  if (!process.env.REDIS_URL) {
    throw new Error('Missing REDIS_URL environment variable');
  }
  return new Redis(process.env.REDIS_URL);
};

const globalForRedis = global as unknown as { redis: Redis | undefined };

export const redis = globalForRedis.redis ?? redisClientFactory();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;