// src/middlewares/cache.ts
import getExpeditiousCache, { ExpeditiousOptions } from 'express-expeditious';
import RedisEngine from 'expeditious-engine-redis';

// ⚙️ Configuración del engine de Redis
const redisEngine = new RedisEngine({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  db: Number(process.env.REDIS_DB || 0),
});

// ⚙️ Configuración por defecto del caché
const defaultOptions: ExpeditiousOptions = {
  namespace: 'expresscache',
  defaultTtl: '15 minutes',
  statusCodeExpires: {
    404: '5 minutes',
    500: 0,
  },
  engine: redisEngine,
};

// 🧩 Inicializa el middleware de caché
export const cacheInit = getExpeditiousCache(defaultOptions);

export default { cacheInit };
