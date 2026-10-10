import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

// Lazy initialization atau fallback untuk build step tanpa DATABASE_URL
const sql = neon(connectionString || 'postgresql://mock:mock@ep-mock.us-east-2.aws.neon.tech/mock');
export const db = drizzle(sql, { schema });
