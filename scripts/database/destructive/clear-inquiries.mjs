import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireExplicitDatabaseWrite } from '../require-explicit-write.mjs';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });
import pg from 'pg';
const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not configured.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const applyChanges = process.argv.includes('--apply');
  if (!applyChanges) {
    const countRes = await pool.query('SELECT COUNT(*)::int AS count FROM "Inquiry"');
    console.log(`Dry run: ${countRes.rows[0].count} inquiries found. No data was changed.`);
    console.log('To keep the newest inquiry and remove older rows, use --apply with the documented database safeguards.');
    return;
  }

  requireExplicitDatabaseWrite({
    operation: 'Delete older inquiries',
    approvalVariable: 'ALLOW_INQUIRY_PURGE',
  });

  // Identify the newest row without exposing guest details in the terminal.
  const latestRes = await pool.query('SELECT id FROM "Inquiry" ORDER BY "createdAt" DESC LIMIT 1');
  if (latestRes.rows.length === 0) {
    console.log("No inquiries found in database.");
    return;
  }

  const latest = latestRes.rows[0];
  // Delete all inquiries except the latest one
  const deleteRes = await pool.query('DELETE FROM "Inquiry" WHERE id != $1', [latest.id]);
  console.log(`Deleted ${deleteRes.rowCount} older inquiries; guest details were not printed.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
