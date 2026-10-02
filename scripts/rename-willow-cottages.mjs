import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log("Fetching current Willow Peak villas from DB...");
  const res = await pool.query('SELECT id, slug, name FROM "Villa" WHERE slug LIKE \'%willow%\'');
  console.log("Current Willow Peak villas in DB:", res.rows);

  // Update Cottage A -> Breeze
  const updateA = await pool.query(
    'UPDATE "Villa" SET name = $1 WHERE slug = $2 OR id = $3 RETURNING id, slug, name',
    ['Breeze', 'willow-peak-cottage-a', 'lonavala-willow-peak-cottage-a']
  );
  console.log("Updated Cottage A to Breeze:", updateA.rows);

  // Update Cottage B -> Crest
  const updateB = await pool.query(
    'UPDATE "Villa" SET name = $1 WHERE slug = $2 OR id = $3 RETURNING id, slug, name',
    ['Crest', 'willow-peak-cottage-b', 'lonavala-willow-peak-cottage-b']
  );
  console.log("Updated Cottage B to Crest:", updateB.rows);

  // Update Cottage C -> Heaven
  const updateC = await pool.query(
    'UPDATE "Villa" SET name = $1 WHERE slug = $2 OR id = $3 RETURNING id, slug, name',
    ['Heaven', 'willow-peak-cottage-c', 'lonavala-willow-peak-cottage-c']
  );
  console.log("Updated Cottage C to Heaven:", updateC.rows);

  // Update entire estate name to reference Breeze, Crest & Heaven
  const updateEntire = await pool.query(
    'UPDATE "Villa" SET name = $1 WHERE slug = $2 OR id = $3 RETURNING id, slug, name',
    ['Willow Peak (Entire Estate - Breeze, Crest & Heaven)', 'willow-peak', 'lonavala-willow-peak']
  );
  console.log("Updated Entire Estate:", updateEntire.rows);

  // Final check
  const finalRes = await pool.query('SELECT id, slug, name FROM "Villa" WHERE slug LIKE \'%willow%\'');
  console.log("\nFinal state of Willow Peak villas in DB:");
  console.log(finalRes.rows);

  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
