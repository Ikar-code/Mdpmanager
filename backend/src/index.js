require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { apiLimiter } = require('./middleware/rateLimiter');
const { authenticate } = require('./middleware/auth');

const authRoutes = require('./routes/auth.routes');
const passwordRoutes = require('./routes/passwords.routes');
const { vaultsRouter, usersRouter } = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3001;

// ==============================
// Sécurité & Middlewares globaux
// ==============================
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' })); // Limite la taille des requêtes
app.use(express.urlencoded({ extended: true }));

// Rate limiting global
app.use('/api', apiLimiter);

// ==============================
// Routes
// ==============================
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/vaults', authenticate, vaultsRouter);
app.use('/api/users', authenticate, usersRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VaultX API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ==============================
// Démarrage
// ==============================
app.listen(PORT, () => {
  console.log(`\n🔐 VaultX Backend démarré`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend autorisé: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`\n📋 Routes disponibles:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/refresh`);
  console.log(`   POST   /api/auth/logout`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/passwords`);
  console.log(`   POST   /api/passwords`);
  console.log(`   GET    /api/passwords/:id`);
  console.log(`   PUT    /api/passwords/:id`);
  console.log(`   DELETE /api/passwords/:id`);
  console.log(`   GET    /api/passwords/stats`);
  console.log(`   POST   /api/passwords/generate`);
  console.log(`   GET    /api/vaults`);
  console.log(`   POST   /api/vaults`);
  console.log(`   PUT    /api/vaults/:id`);
  console.log(`   DELETE /api/vaults/:id`);
  console.log(`   GET    /health\n`);
});

module.exports = app;
