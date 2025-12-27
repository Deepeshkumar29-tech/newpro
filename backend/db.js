// db.js
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// In your file.env the variable is DATABASEURL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASEURL is not set in file.env');
}

const sql = postgres(connectionString, {
  ssl: 'require',
});

export default sql;
