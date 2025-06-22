import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from '@/db/schema';
import { USER_ROLES } from '@/types/index';
  
const db = drizzle({ connection: process.env.DATABASE_URL!, casing: 'snake_case' });

async function main() {
  const user: typeof usersTable.$inferInsert = {
    firstName: process.env.OWNER_NAME ?? '',
    lastName: process.env.OWNER_LAST_NAME ?? '',
    email: process.env.OWNER_EMAIL ?? '',
    hashedPassword: process.env.OWNER_PASSWORD_HASHED ?? '',
    role: USER_ROLES.OWNER,
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')
}

main();
