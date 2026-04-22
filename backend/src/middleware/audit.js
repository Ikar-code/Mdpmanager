const pool = require('../../config/database');

/**
 * Enregistre une action dans les logs d'audit
 */
async function logAudit(userId, action, options = {}) {
  const { resourceType, resourceId, ipAddress, userAgent, success = true, metadata } = options;

  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, success, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, action, resourceType, resourceId, ipAddress, userAgent, success, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (err) {
    // Le logging ne doit jamais faire planter l'app
    console.error('Erreur audit log:', err.message);
  }
}

/**
 * Middleware qui log automatiquement chaque requête authentifiée
 */
function auditMiddleware(action, resourceType) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (req.user) {
        logAudit(req.user.id, action, {
          resourceType,
          resourceId: req.params.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          success: res.statusCode < 400,
        });
      }
      return originalJson(data);
    };
    next();
  };
}

module.exports = { logAudit, auditMiddleware };
