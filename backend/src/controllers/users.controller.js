const bcrypt = require('bcryptjs');
const pool = require('../../config/database');
const { revokeAllUserTokens } = require('../services/token');
const { logAudit } = require('../middleware/audit');

/**
 * PUT /api/users/profile
 */
async function updateProfile(req, res) {
  const { username } = req.body;

  if (!username || username.length < 2) {
    return res.status(400).json({ error: 'Nom d\'utilisateur invalide' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, email, username, plan',
      [username, req.user.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * PUT /api/users/password
 */
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 8 caractères' });
  }

  try {
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const match = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);

    // Déconnecter toutes les sessions
    await revokeAllUserTokens(req.user.id);

    await logAudit(req.user.id, 'PASSWORD_CHANGED', { ipAddress: req.ip });

    res.json({ message: 'Mot de passe mis à jour. Reconnecte-toi.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * GET /api/users/audit-logs
 */
async function getAuditLogs(req, res) {
  try {
    const result = await pool.query(
      `SELECT action, resource_type, ip_address, success, created_at, metadata
       FROM audit_logs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.user.id]
    );
    res.json({ logs: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * DELETE /api/users/account
 * Supprime le compte et toutes les données
 */
async function deleteAccount(req, res) {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Mot de passe requis pour supprimer le compte' });
  }

  try {
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const match = await bcrypt.compare(password, result.rows[0].password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // CASCADE supprime tout (passwords, vaults, tokens, logs)
    await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);

    res.json({ message: 'Compte supprimé définitivement' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { updateProfile, changePassword, getAuditLogs, deleteAccount };
