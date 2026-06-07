import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').default('3000').asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  MAILER_SERVICE: get('MAILER_SERVICE').default('gmail').asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').default('').asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').default('').asString(),
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
  REDIS_HOST: get('REDIS_HOST').default('localhost').asString(),
  REDIS_PORT: get('REDIS_PORT').default('6379').asPortNumber(),
  REDIS_DB: get('REDIS_DB').default('0').asInt(),
  REDIS_URL: get('REDIS_URL').default('redis://localhost:6379').asString(),
};
