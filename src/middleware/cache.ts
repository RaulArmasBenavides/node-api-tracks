// src/middleware/cache.ts
import type { RequestHandler } from "express";
import getExpeditious from "express-expeditious";

type ExpeditiousOptions = {
  namespace?: string;
  defaultTtl?: string | number;
  statusCodeExpires?: Record<number, string | number>;
};

const defaultOptions: ExpeditiousOptions = {
  namespace: "expresscache",
  defaultTtl: "15 minute", // también puede ser número en ms
  statusCodeExpires: {
    404: "5 minutes",
    500: 0, // sin cache
  },
};

// export const cacheInit = getExpeditious(defaultOptions) as unknown as RequestHandler;

// export default cacheInit;
