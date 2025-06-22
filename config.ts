import envSmart from 'env-smart';

import { Configuration } from './types';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(join(__filename, '..'));

const generatedConfig = envSmart.config<Configuration>(env => ({
  dbUrl: env.DATABASE_URL,
  ownerFirstName: env.OWNER_FIRST_NAME,
  ownerLastName: env.OWNER_LAST_NAME,
  ownerEmail: env.OWNER_EMAIL,
  ownerHashedPassword: env.OWNER_PASSWORD_HASHED,
  menuDurationInDays: 3,
  rootDir,
}));

const config = Object.freeze(generatedConfig);

export default config;