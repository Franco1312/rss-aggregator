import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  cacheTtlMs: parseInt(process.env.CACHE_TTL_MS || '300000', 10),
  newsRefreshIntervalMs: parseInt(process.env.NEWS_REFRESH_INTERVAL_MS || '600000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;

