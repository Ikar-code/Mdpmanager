const jwt = require('jsonwebtoken');
const pool = require('../../config/database');

/**
 * Middleware: vérifie le JWT dans le header Authorization
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifie que l'utilisateur existe toujours et est actif
    const result = await pool.query(
      'SELECT id, email, username, plan, is_active FROM users WHERE id = $1',
      [decoded.sub]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({ error: 'Utilisateur introuvable ou désactivé' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
}

/**
 * Middleware: vérifie que l'utilisateur a un plan Pro
 */
function requirePro(req, res, next) {
  if (req.user.plan === 'free') {
    return res.status(403).json({
      error: 'Cette fonctionnalité nécessite un abonnement Pro',
      code: 'UPGRADE_REQUIRED',
    });
  }
  next();
}

module.exports = { authenticate, requirePro };
