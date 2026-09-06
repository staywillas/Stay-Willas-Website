import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  // Find the latest inquiry
  const latestRes = await pool.query('SELECT id, name, phone, "createdAt" FROM "Inquiry" ORDER BY "createdAt" DESC LIMIT 1');
  if (latestRes.rows.length === 0) {
    console.log("No inquiries found in database.");
    await pool.end();
    return;
  }

  const latest = latestRes.rows[0];
  console.log(`Keeping latest inquiry: [${latest.id}] ${latest.name} (${latest.phone}) created at ${latest.createdAt}`);

  // Delete all inquiries except the latest one
  const deleteRes = await pool.query('DELETE FROM "Inquiry" WHERE id != $1', [latest.id]);
  console.log(`Deleted ${deleteRes.rowCount} older inquiries.`);

  // Verify remaining inquiries
  const verifyRes = await pool.query('SELECT id, name, phone, email, type, "createdAt" FROM "Inquiry" ORDER BY "createdAt" DESC');
  console.log(`Remaining inquiries in DB: ${verifyRes.rows.length}`);
  console.log(JSON.stringify(verifyRes.rows, null, 2));

  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
