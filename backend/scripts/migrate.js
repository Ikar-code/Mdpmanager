require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'vaultx',
  user: process.env.DB_USER || 'vaultx_user',
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  console.log('🚀 Lancement de la migration...');
  
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  
  try {
    await pool.query(sql);
    console.log('✅ Migration réussie ! Toutes les tables ont été créées.');
  } catch (err) {
    console.error('❌ Erreur lors de la migration:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
