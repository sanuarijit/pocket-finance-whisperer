
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Make DATABASE_URL optional since we're using localStorage primarily
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/moneywise';

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });
