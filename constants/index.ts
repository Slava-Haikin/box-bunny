import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(join(__filename, '..'));

const MENU_DURATION_IN_DAYS = 3;

export { rootDir, MENU_DURATION_IN_DAYS }