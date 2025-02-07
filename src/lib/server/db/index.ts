import { drizzle } from 'drizzle-orm/postgres-js';
// import { drizzle } from 'drizzle-orm/neon-http';
import postgres from 'postgres';
// import { postgres } from "bun";
// import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';
import { UsersTable } from './schema';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// const client = neon(env.DATABASE_URL);
const client = postgres(env.DATABASE_URL);
export const db = drizzle({ client, casing: 'snake_case' });

await db.select().from(UsersTable);
