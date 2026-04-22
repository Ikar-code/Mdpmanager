const pool = require('../../config/database');
const { encryptPasswordEntry, decryptPasswordEntry, generateStrongPassword } = require('../services/encryption');
const { logAudit } = require('../middleware/audit');

/**
 * GET /api/passwords
 * Liste tous les mots de passe de l'utilisateur (déchiffrés)
 */
async function getAll(req, res) {
  const { category, favorite, vault_id, search } = req.query;

  try {
    let query = `
      SELECT p.*, v.name as vault_name, v.color as vault_color
      FROM passwords p
      LEFT JOIN vaults v ON v.id = p.vault_id
      WHERE p.user_id = $1
    `;
    const params = [req.user.id];
    let paramCount = 1;

    if (category) {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      params.push(category);
    }
    if (favorite === 'true') {
      query += ` AND p.is_favorite = TRUE`;
    }
    if (vault_id) {
      paramCount++;
      query += ` AND p.vault_id = $${paramCount}`;
      params.push(vault_id);
    }

    query += ` ORDER BY p.updated_at DESC`;

    const result = await pool.query(query, params);

    // Déchiffrer toutes les entrées
    const passwords = result.rows.map(row => ({
      ...decryptPasswordEntry(row),
      vault_name: row.vault_name,
      vault_color: row.vault_color,
    }));

    // Recherche côté serveur après déchiffrement (title/username/url)
    const filtered = search
      ? passwords.filter(p =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.username?.toLowerCase().includes(search.toLowerCase()) ||
          p.url?.toLowerCase().includes(search.toLowerCase())
        )
      : passwords;

    // Ne jamais renvoyer le mot de passe en clair dans la liste
    const safeList = filtered.map(({ password, ...rest }) => rest);

    res.json({ passwords: safeList, total: safeList.length });
  } catch (err) {
    console.error('Erreur getAll passwords:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * GET /api/passwords/:id
 * Récupère UN mot de passe avec son champ password déchiffré
 */
async function getOne(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM passwords WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrée introuvable' });
    }

    // Mettre à jour last_used_at
    await pool.query(
      'UPDATE passwords SET last_used_at = NOW() WHERE id = $1',
      [req.params.id]
    );

    await logAudit(req.user.id, 'PASSWORD_VIEW', {
      resourceType: 'password',
      resourceId: req.params.id,
      ipAddress: req.ip,
    });

    res.json({ password: decryptPasswordEntry(result.rows[0]) });
  } catch (err) {
    console.error('Erreur getOne password:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/passwords
 * Crée un nouveau mot de passe chiffré
 */
async function create(req, res) {
  const { title, username, password, url, notes, category, vault_id, is_favorite } = req.body;

  if (!title || !password) {
    return res.status(400).json({ error: 'Titre et mot de passe requis' });
  }

  // Vérifier la limite du plan Free (max 20 entrées)
  if (req.user.plan === 'free') {
    const count = await pool.query(
      'SELECT COUNT(*) FROM passwords WHERE user_id = $1',
      [req.user.id]
    );
    if (parseInt(count.rows[0].count) >= 20) {
      return res.status(403).json({
        error: 'Limite du plan gratuit atteinte (20 mots de passe). Passe au plan Pro !',
        code: 'LIMIT_REACHED',
      });
    }
  }

  try {
    // Vérifier que le vault appartient à l'utilisateur
    if (vault_id) {
      const vault = await pool.query(
        'SELECT id FROM vaults WHERE id = $1 AND user_id = $2',
        [vault_id, req.user.id]
      );
      if (vault.rows.length === 0) {
        return res.status(400).json({ error: 'Coffre invalide' });
      }
    }

    const encrypted = encryptPasswordEntry({ title, username, password, url, notes });

    const result = await pool.query(
      `INSERT INTO passwords (
        user_id, vault_id, category, is_favorite,
        title_encrypted, title_iv, title_tag,
        username_encrypted, username_iv, username_tag,
        password_encrypted, password_iv, password_tag,
        url_encrypted, url_iv, url_tag,
        notes_encrypted, notes_iv, notes_tag
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16,
        $17, $18, $19
      ) RETURNING id, created_at`,
      [
        req.user.id, vault_id || null, category || 'general', is_favorite || false,
        encrypted.title_encrypted, encrypted.title_iv, encrypted.title_tag,
        encrypted.username_encrypted, encrypted.username_iv, encrypted.username_tag,
        encrypted.password_encrypted, encrypted.password_iv, encrypted.password_tag,
        encrypted.url_encrypted, encrypted.url_iv, encrypted.url_tag,
        encrypted.notes_encrypted, encrypted.notes_iv, encrypted.notes_tag,
      ]
    );

    await logAudit(req.user.id, 'PASSWORD_CREATE', {
      resourceType: 'password',
      resourceId: result.rows[0].id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Mot de passe enregistré',
      id: result.rows[0].id,
      created_at: result.rows[0].created_at,
    });
  } catch (err) {
    console.error('Erreur create password:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * PUT /api/passwords/:id
 * Met à jour un mot de passe existant
 */
async function update(req, res) {
  const { title, username, password, url, notes, category, vault_id, is_favorite } = req.body;

  try {
    const existing = await pool.query(
      'SELECT * FROM passwords WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Entrée introuvable' });
    }

    const current = decryptPasswordEntry(existing.rows[0]);

    // Merge: garder les valeurs actuelles si non fournies
    const encrypted = encryptPasswordEntry({
      title: title ?? current.title,
      username: username ?? current.username,
      password: password ?? current.password,
      url: url ?? current.url,
      notes: notes ?? current.notes,
    });

    const passwordChanged = password && password !== current.password;

    await pool.query(
      `UPDATE passwords SET
        vault_id = COALESCE($1, vault_id),
        category = COALESCE($2, category),
        is_favorite = COALESCE($3, is_favorite),
        title_encrypted = $4, title_iv = $5, title_tag = $6,
        username_encrypted = $7, username_iv = $8, username_tag = $9,
        password_encrypted = $10, password_iv = $11, password_tag = $12,
        url_encrypted = $13, url_iv = $14, url_tag = $15,
        notes_encrypted = $16, notes_iv = $17, notes_tag = $18,
        password_changed_at = CASE WHEN $19 THEN NOW() ELSE password_changed_at END
      WHERE id = $20 AND user_id = $21`,
      [
        vault_id, category, is_favorite,
        encrypted.title_encrypted, encrypted.title_iv, encrypted.title_tag,
        encrypted.username_encrypted, encrypted.username_iv, encrypted.username_tag,
        encrypted.password_encrypted, encrypted.password_iv, encrypted.password_tag,
        encrypted.url_encrypted, encrypted.url_iv, encrypted.url_tag,
        encrypted.notes_encrypted, encrypted.notes_iv, encrypted.notes_tag,
        passwordChanged,
        req.params.id, req.user.id,
      ]
    );

    await logAudit(req.user.id, 'PASSWORD_UPDATE', {
      resourceType: 'password',
      resourceId: req.params.id,
      ipAddress: req.ip,
    });

    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    console.error('Erreur update password:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * DELETE /api/passwords/:id
 */
async function remove(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM passwords WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrée introuvable' });
    }

    await logAudit(req.user.id, 'PASSWORD_DELETE', {
      resourceType: 'password',
      resourceId: req.params.id,
      ipAddress: req.ip,
    });

    res.json({ message: 'Mot de passe supprimé' });
  } catch (err) {
    console.error('Erreur delete password:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/passwords/generate
 * Génère un mot de passe fort
 */
async function generate(req, res) {
  const { length = 20 } = req.body;
  const len = Math.min(Math.max(parseInt(length), 8), 128);
  res.json({ password: generateStrongPassword(len) });
}

/**
 * GET /api/passwords/stats
 * Statistiques du coffre
 */
async function stats(req, res) {
  try {
    const result = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_favorite) as favorites,
        COUNT(*) FILTER (WHERE is_compromised) as compromised,
        COUNT(*) FILTER (WHERE password_changed_at < NOW() - INTERVAL '90 days') as old_passwords,
        COUNT(DISTINCT category) as categories
       FROM passwords WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({ stats: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getAll, getOne, create, update, remove, generate, stats };
