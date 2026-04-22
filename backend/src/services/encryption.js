const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const TAG_LENGTH = 16; // 128 bits

/**
 * Récupère la clé de chiffrement depuis l'env
 */
function getEncryptionKey() {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error('ENCRYPTION_KEY invalide. Doit être 64 caractères hex (32 bytes).');
  }
  return Buffer.from(keyHex, 'hex');
}

/**
 * Chiffre une valeur avec AES-256-GCM
 * @param {string} plaintext - Texte en clair
 * @returns {{ encrypted: string, iv: string, tag: string }}
 */
function encrypt(plaintext) {
  if (!plaintext) return { encrypted: null, iv: null, tag: null };

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(String(plaintext), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

/**
 * Déchiffre une valeur avec AES-256-GCM
 * @param {string} encrypted - Texte chiffré en hex
 * @param {string} ivHex - IV en hex
 * @param {string} tagHex - Auth tag en hex
 * @returns {string} Texte en clair
 */
function decrypt(encrypted, ivHex, tagHex) {
  if (!encrypted || !ivHex || !tagHex) return null;

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Chiffre tous les champs sensibles d'une entrée de mot de passe
 */
function encryptPasswordEntry({ title, username, password, url, notes }) {
  const encTitle = encrypt(title);
  const encUsername = encrypt(username);
  const encPassword = encrypt(password);
  const encUrl = encrypt(url);
  const encNotes = encrypt(notes);

  return {
    title_encrypted: encTitle.encrypted,
    title_iv: encTitle.iv,
    title_tag: encTitle.tag,

    username_encrypted: encUsername.encrypted,
    username_iv: encUsername.iv,
    username_tag: encUsername.tag,

    password_encrypted: encPassword.encrypted,
    password_iv: encPassword.iv,
    password_tag: encPassword.tag,

    url_encrypted: encUrl.encrypted,
    url_iv: encUrl.iv,
    url_tag: encUrl.tag,

    notes_encrypted: encNotes.encrypted,
    notes_iv: encNotes.iv,
    notes_tag: encNotes.tag,
  };
}

/**
 * Déchiffre une ligne de la BDD en objet lisible
 */
function decryptPasswordEntry(row) {
  return {
    id: row.id,
    vault_id: row.vault_id,
    category: row.category,
    is_favorite: row.is_favorite,
    is_compromised: row.is_compromised,
    last_used_at: row.last_used_at,
    password_changed_at: row.password_changed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,

    title: decrypt(row.title_encrypted, row.title_iv, row.title_tag),
    username: decrypt(row.username_encrypted, row.username_iv, row.username_tag),
    password: decrypt(row.password_encrypted, row.password_iv, row.password_tag),
    url: decrypt(row.url_encrypted, row.url_iv, row.url_tag),
    notes: decrypt(row.notes_encrypted, row.notes_iv, row.notes_tag),
  };
}

/**
 * Génère un mot de passe fort aléatoire
 */
function generateStrongPassword(length = 20) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const randomBytes = crypto.randomBytes(length);
  return Array.from(randomBytes)
    .map((byte) => charset[byte % charset.length])
    .join('');
}

module.exports = {
  encrypt,
  decrypt,
  encryptPasswordEntry,
  decryptPasswordEntry,
  generateStrongPassword,
};
