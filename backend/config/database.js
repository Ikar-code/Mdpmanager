const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'vaultx',
  user: process.env.DB_USER || 'vaultx_user',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Erreur inattendue sur le client PostgreSQL:', err);
  process.exit(-1);
});

// Test de connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Impossible de se connecter à PostgreSQL:', err.message);
    return;
  }
  release();
  console.log('✅ Connecté à PostgreSQL');
});

module.exports = pool;
