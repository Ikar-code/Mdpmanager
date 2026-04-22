const bcrypt = require('bcryptjs');
const validator = require('validator');
const pool = require('../../config/database');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken, revokeAllUserTokens } = require('../services/token');
const { logAudit } = require('../middleware/audit');

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  const { email, username, password } = req.body;

  // Validation
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, nom d\'utilisateur et mot de passe requis' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }
  if (username.length < 2 || username.length > 50) {
    return res.status(400).json({ error: 'Nom d\'utilisateur: 2 à 50 caractères' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 8 caractères' });
  }

  try {
    // Vérifier si l'email existe déjà
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, plan, created_at`,
      [email.toLowerCase(), username, passwordHash]
    );

    const user = result.rows[0];

    // Créer le coffre par défaut
    await pool.query(
      `INSERT INTO vaults (user_id, name, color, icon) VALUES ($1, $2, $3, $4)`,
      [user.id, 'Mon coffre', '#00ff88', 'shield']
    );

    // Générer les tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    await logAudit(user.id, 'USER_REGISTER', {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json({
      message: 'Compte créé avec succès',
      user: { id: user.id, email: user.email, username: user.username, plan: user.plan },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('Erreur register:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    // Vérifier si le compte est bloqué
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remaining = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({
        error: `Compte temporairement bloqué. Réessaie dans ${remaining} minute(s).`
      });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      // Incrémenter les tentatives échouées
      const attempts = user.failed_login_attempts + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await pool.query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
        [attempts, lockUntil, user.id]
      );

      await logAudit(user.id, 'LOGIN_FAILED', {
        ipAddress: req.ip,
        success: false,
        metadata: { attempts },
      });

      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    // Reset tentatives échouées + mise à jour last_login
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    await logAudit(user.id, 'LOGIN_SUCCESS', {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.json({
      message: 'Connexion réussie',
      user: { id: user.id, email: user.email, username: user.username, plan: user.plan },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/auth/refresh
 * Renouvelle l'access token via refresh token
 */
async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token manquant' });
  }

  try {
    const tokenData = await verifyRefreshToken(refreshToken);
    const user = { id: tokenData.user_id, email: tokenData.email, plan: tokenData.plan };

    // Rotation du refresh token (révoque l'ancien, crée un nouveau)
    await revokeRefreshToken(refreshToken);
    const newRefreshToken = await generateRefreshToken(user.id);
    const accessToken = generateAccessToken(user);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res) {
  const { refreshToken, logoutAll } = req.body;

  try {
    if (logoutAll && req.user) {
      await revokeAllUserTokens(req.user.id);
    } else if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    await logAudit(req.user?.id, 'LOGOUT', { ipAddress: req.ip });

    res.json({ message: 'Déconnecté avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, email, username, plan, plan_expires_at, created_at, last_login_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { register, login, refresh, logout, me };
