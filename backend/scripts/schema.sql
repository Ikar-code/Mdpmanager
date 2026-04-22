-- ==============================
--  VaultX - Migration Base de données
--  Exécuter avec: node scripts/migrate.js
-- ==============================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================
-- TABLE: users
-- ==============================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Plan (free / pro)
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  plan_expires_at TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  
  -- Sécurité
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP,
  last_login_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- TABLE: refresh_tokens
-- ==============================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- TABLE: vaults (coffres-forts par utilisateur)
-- ==============================
CREATE TABLE IF NOT EXISTS vaults (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL DEFAULT 'Mon coffre',
  color VARCHAR(7) DEFAULT '#00ff88',
  icon VARCHAR(50) DEFAULT 'shield',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- TABLE: passwords (mots de passe chiffrés)
-- ==============================
CREATE TABLE IF NOT EXISTS passwords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vault_id UUID REFERENCES vaults(id) ON DELETE SET NULL,
  
  -- Données chiffrées (AES-256-GCM)
  title_encrypted TEXT NOT NULL,
  title_iv VARCHAR(32) NOT NULL,
  title_tag VARCHAR(32) NOT NULL,
  
  username_encrypted TEXT,
  username_iv VARCHAR(32),
  username_tag VARCHAR(32),
  
  password_encrypted TEXT NOT NULL,
  password_iv VARCHAR(32) NOT NULL,
  password_tag VARCHAR(32) NOT NULL,
  
  url_encrypted TEXT,
  url_iv VARCHAR(32),
  url_tag VARCHAR(32),
  
  notes_encrypted TEXT,
  notes_iv VARCHAR(32),
  notes_tag VARCHAR(32),
  
  -- Métadonnées (non chiffrées pour la recherche)
  category VARCHAR(50) DEFAULT 'general',
  is_favorite BOOLEAN DEFAULT FALSE,
  is_compromised BOOLEAN DEFAULT FALSE,
  
  -- Dates
  last_used_at TIMESTAMP,
  password_changed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- TABLE: audit_logs (traçabilité)
-- ==============================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- INDEX pour les performances
-- ==============================
CREATE INDEX IF NOT EXISTS idx_passwords_user_id ON passwords(user_id);
CREATE INDEX IF NOT EXISTS idx_passwords_vault_id ON passwords(vault_id);
CREATE INDEX IF NOT EXISTS idx_passwords_category ON passwords(category);
CREATE INDEX IF NOT EXISTS idx_passwords_favorite ON passwords(is_favorite);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ==============================
-- TRIGGER: updated_at automatique
-- ==============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_passwords_updated_at BEFORE UPDATE ON passwords
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaults_updated_at BEFORE UPDATE ON vaults
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
