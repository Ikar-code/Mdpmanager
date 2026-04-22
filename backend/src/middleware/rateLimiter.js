const rateLimit = require('express-rate-limit');

// Rate limiter général pour l'API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Trop de requêtes, réessaie dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter strict pour l'authentification (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Trop de tentatives de connexion. Réessaie dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiter pour la création de mots de passe
const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'Trop de créations. Attends un peu.' },
});

module.exports = { apiLimiter, authLimiter, createLimiter };
