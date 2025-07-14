import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

export const db = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: 5432,
    database: process.env.PGDATABASE,
    ssl: { rejectUnauthorized: false }   // ✅ Cloud ke liye yeh karna zaroori hai
});
