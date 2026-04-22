const pool = require('../../config/database');

/**
 * GET /api/vaults
 */
async function getAll(req, res) {
  try {
    const result = await pool.query(
      `SELECT v.*, COUNT(p.id) as password_count
       FROM vaults v
       LEFT JOIN passwords p ON p.vault_id = v.id
       WHERE v.user_id = $1
       GROUP BY v.id
       ORDER BY v.created_at ASC`,
      [req.user.id]
    );
    res.json({ vaults: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * POST /api/vaults
 */
async function create(req, res) {
  const { name, color, icon } = req.body;

  if (!name) return res.status(400).json({ error: 'Nom du coffre requis' });

  // Limite: 3 coffres en Free, illimité en Pro
  if (req.user.plan === 'free') {
    const count = await pool.query(
      'SELECT COUNT(*) FROM vaults WHERE user_id = $1',
      [req.user.id]
    );
    if (parseInt(count.rows[0].count) >= 3) {
      return res.status(403).json({
        error: 'Limite du plan gratuit (3 coffres). Passe au plan Pro !',
        code: 'LIMIT_REACHED',
      });
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO vaults (user_id, name, color, icon)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, name, color || '#00ff88', icon || 'shield']
    );
    res.status(201).json({ vault: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * PUT /api/vaults/:id
 */
async function update(req, res) {
  const { name, color, icon } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vaults SET
        name = COALESCE($1, name),
        color = COALESCE($2, color),
        icon = COALESCE($3, icon)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [name, color, icon, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Coffre introuvable' });
    }

    res.json({ vault: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

/**
 * DELETE /api/vaults/:id
 */
async function remove(req, res) {
  try {
    // Les mots de passe du coffre passent à vault_id = NULL (ON DELETE SET NULL)
    const result = await pool.query(
      'DELETE FROM vaults WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Coffre introuvable' });
    }

    res.json({ message: 'Coffre supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getAll, create, update, remove };
