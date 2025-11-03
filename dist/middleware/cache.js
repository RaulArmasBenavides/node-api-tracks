"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultOptions = {
    namespace: "expresscache",
    defaultTtl: "15 minute", // también puede ser número en ms
    statusCodeExpires: {
        404: "5 minutes",
        500: 0, // sin cache
    },
};
// export const cacheInit = getExpeditious(defaultOptions) as unknown as RequestHandler;
// export default cacheInit;
