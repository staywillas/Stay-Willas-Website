import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const countRes = await pool.query('SELECT COUNT(*) FROM "Inquiry"');
  console.log("Inquiries in DB before delete:", countRes.rows[0].count);
  const res = await pool.query('DELETE FROM "Inquiry"');
  console.log("Deleted inquiries count:", res.rowCount);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
