import envSmart from 'env-smart';

import { Configuration, CookingStyle } from './types';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(join(__filename, '..'));

const deriveMenuUpdateInterval = (cookingStyle: CookingStyle) => {
  switch (cookingStyle) {
    case CookingStyle.Chief:
      return 1;
    case CookingStyle.Regular:
      return 3;
    default:
      return 7;
  }
}

const generatedConfig = envSmart.config<Configuration>(env => ({
  dbUrl: env.DATABASE_URL,
  ownerFirstName: env.OWNER_FIRST_NAME,
  ownerLastName: env.OWNER_LAST_NAME,
  ownerEmail: env.OWNER_EMAIL,
  ownerHashedPassword: env.OWNER_PASSWORD_HASHED,
  menuDurationInDays: 7,
  menuUpdateInterval: deriveMenuUpdateInterval(CookingStyle.Lazy),
  weekendIncluded: false,
  rootDir,
}));

const config = Object.freeze(generatedConfig);

export default config;