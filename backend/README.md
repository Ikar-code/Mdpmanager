# 🔐 VaultX Backend

Backend sécurisé pour le gestionnaire de mots de passe VaultX.

## Stack technique

- **Node.js + Express** — API REST
- **PostgreSQL** — Base de données
- **AES-256-GCM** — Chiffrement des mots de passe
- **JWT + Refresh Tokens** — Authentification multi-utilisateurs
- **bcrypt** (12 rounds) — Hashage des mots de passe maîtres
- **Helmet + CORS + Rate Limiting** — Sécurité

---

## 🚀 Installation

### 1. Prérequis

- Node.js 18+
- PostgreSQL 14+

### 2. Installer les dépendances

```bash
cd backend
npm install
```

### 3. Configurer l'environnement

```bash
cp .env.example .env
```

Édite `.env` et remplis les valeurs :

```bash
# Générer la clé de chiffrement (OBLIGATOIRE)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Générer le secret JWT (OBLIGATOIRE)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Créer la base de données PostgreSQL

```bash
# Connexion à PostgreSQL
psql -U postgres

# Dans psql:
CREATE DATABASE vaultx;
CREATE USER vaultx_user WITH PASSWORD 'ton_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE vaultx TO vaultx_user;
\q
```

### 5. Lancer les migrations

```bash
npm run migrate
```

### 6. Démarrer le serveur

```bash
# Développement (avec hot reload)
npm run dev

# Production
npm start
```

Le serveur démarre sur `http://localhost:3001`

---

## 📋 API Reference

### Auth

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/refresh` | Renouveler le token |
| POST | `/api/auth/logout` | Déconnexion |
| GET | `/api/auth/me` | Profil utilisateur |

### Mots de passe

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/passwords` | Lister tous les mots de passe |
| POST | `/api/passwords` | Créer un mot de passe |
| GET | `/api/passwords/:id` | Récupérer un mot de passe (avec le champ password) |
| PUT | `/api/passwords/:id` | Modifier |
| DELETE | `/api/passwords/:id` | Supprimer |
| GET | `/api/passwords/stats` | Statistiques |
| POST | `/api/passwords/generate` | Générer un mot de passe fort |

### Coffres

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/vaults` | Lister les coffres |
| POST | `/api/vaults` | Créer un coffre |
| PUT | `/api/vaults/:id` | Modifier |
| DELETE | `/api/vaults/:id` | Supprimer |

---

## 🔒 Sécurité

- Tous les champs sensibles (title, username, password, url, notes) sont chiffrés individuellement avec AES-256-GCM
- Chaque champ a son propre IV aléatoire → impossible de détecter les doublons
- Les mots de passe maîtres sont hashés avec bcrypt (12 rounds)
- Blocage automatique après 5 tentatives échouées (15 min)
- Logs d'audit complets pour chaque action
- Rate limiting sur toutes les routes

## 📦 Plans

| Fonctionnalité | Free | Pro |
|----------------|------|-----|
| Mots de passe | 20 | Illimité |
| Coffres | 3 | Illimité |
| Logs d'audit | ✅ | ✅ |
| Export | ❌ | ✅ |

---

## 🔗 Connexion avec le Frontend React

Dans ton frontend, ajoute dans `.env`:

```
VITE_API_URL=http://localhost:3001
```

Exemple d'appel API :

```typescript
// Login
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { accessToken, refreshToken, user } = await res.json();

// Appel authentifié
const passwords = await fetch(`${import.meta.env.VITE_API_URL}/api/passwords`, {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```
