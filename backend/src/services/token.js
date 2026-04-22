const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../../config/database');

/**
 * Génère un access token JWT (courte durée)
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      plan: user.plan,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Génère un refresh token (longue durée) et le stocke en BDD
 */
async function generateRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 jours

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, tokenHash, expiresAt]
  );

  return token;
}

/**
 * Vérifie un refresh token et retourne l'userId
 */
async function verifyRefreshToken(token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const result = await pool.query(
    `SELECT rt.*, u.id as user_id, u.email, u.plan, u.is_active
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1 AND rt.expires_at > NOW()`,
    [tokenHash]
  );

  if (result.rows.length === 0) {
    throw new Error('Refresh token invalide ou expiré');
  }

  const row = result.rows[0];
  if (!row.is_active) {
    throw new Error('Compte désactivé');
  }

  return row;
}

/**
 * Révoque un refresh token
 */
async function revokeRefreshToken(token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
}

/**
 * Révoque tous les refresh tokens d'un utilisateur (déconnexion totale)
 */
async function revokeAllUserTokens(userId) {
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
};
