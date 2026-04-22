// ==============================
// VaultX - API Client
// À placer dans: src/services/api.ts
// ==============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ==============================
// Gestion des tokens
// ==============================
const TokenStorage = {
  getAccess: () => localStorage.getItem('vaultx_access_token'),
  getRefresh: () => localStorage.getItem('vaultx_refresh_token'),
  set: (access: string, refresh: string) => {
    localStorage.setItem('vaultx_access_token', access);
    localStorage.setItem('vaultx_refresh_token', refresh);
  },
  clear: () => {
    localStorage.removeItem('vaultx_access_token');
    localStorage.removeItem('vaultx_refresh_token');
  },
};

// ==============================
// Fetch avec refresh automatique
// ==============================
async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = TokenStorage.getAccess();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // Token expiré → tentative de refresh
  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));
    if (data.code === 'TOKEN_EXPIRED') {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${TokenStorage.getAccess()}`;
        res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
      } else {
        TokenStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
    }
  }

  return res;
}

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = TokenStorage.getRefresh();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const { accessToken, refreshToken: newRefresh } = await res.json();
    TokenStorage.set(accessToken, newRefresh);
    return true;
  } catch {
    return false;
  }
}

// ==============================
// Auth API
// ==============================
export const AuthAPI = {
  async register(email: string, username: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    TokenStorage.set(data.accessToken, data.refreshToken);
    return data;
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    TokenStorage.set(data.accessToken, data.refreshToken);
    return data;
  },

  async logout() {
    const refreshToken = TokenStorage.getRefresh();
    await apiFetch('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    TokenStorage.clear();
  },

  async me() {
    const res = await apiFetch('/api/auth/me');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.user;
  },

  isLoggedIn: () => !!TokenStorage.getAccess(),
};

// ==============================
// Passwords API
// ==============================
export type PasswordEntry = {
  id: string;
  title: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  category: string;
  is_favorite: boolean;
  is_compromised: boolean;
  vault_id?: string;
  vault_name?: string;
  vault_color?: string;
  last_used_at?: string;
  password_changed_at?: string;
  created_at: string;
  updated_at: string;
};

export type PasswordFilters = {
  category?: string;
  favorite?: boolean;
  vault_id?: string;
  search?: string;
};

export const PasswordsAPI = {
  async getAll(filters?: PasswordFilters): Promise<{ passwords: PasswordEntry[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.favorite) params.set('favorite', 'true');
    if (filters?.vault_id) params.set('vault_id', filters.vault_id);
    if (filters?.search) params.set('search', filters.search);

    const res = await apiFetch(`/api/passwords?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async getOne(id: string): Promise<PasswordEntry> {
    const res = await apiFetch(`/api/passwords/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.password;
  },

  async create(entry: Omit<PasswordEntry, 'id' | 'created_at' | 'updated_at'>) {
    const res = await apiFetch('/api/passwords', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async update(id: string, entry: Partial<PasswordEntry>) {
    const res = await apiFetch(`/api/passwords/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async delete(id: string) {
    const res = await apiFetch(`/api/passwords/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async generate(length = 20): Promise<string> {
    const res = await apiFetch('/api/passwords/generate', {
      method: 'POST',
      body: JSON.stringify({ length }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.password;
  },

  async stats() {
    const res = await apiFetch('/api/passwords/stats');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.stats;
  },
};

// ==============================
// Vaults API
// ==============================
export type Vault = {
  id: string;
  name: string;
  color: string;
  icon: string;
  password_count: number;
  created_at: string;
};

export const VaultsAPI = {
  async getAll(): Promise<Vault[]> {
    const res = await apiFetch('/api/vaults');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.vaults;
  },

  async create(vault: { name: string; color?: string; icon?: string }) {
    const res = await apiFetch('/api/vaults', {
      method: 'POST',
      body: JSON.stringify(vault),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.vault;
  },

  async update(id: string, vault: { name?: string; color?: string; icon?: string }) {
    const res = await apiFetch(`/api/vaults/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vault),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.vault;
  },

  async delete(id: string) {
    const res = await apiFetch(`/api/vaults/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },
};

// ==============================
// Users API
// ==============================
export const UsersAPI = {
  async updateProfile(username: string) {
    const res = await apiFetch('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.user;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiFetch('/api/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async getAuditLogs() {
    const res = await apiFetch('/api/users/audit-logs');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.logs;
  },

  async deleteAccount(password: string) {
    const res = await apiFetch('/api/users/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    TokenStorage.clear();
    return data;
  },
};
