import React, { useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { AuthContext } from './authContext.js';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('creatoros.token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('creatoros.user');
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(() => ({
    token,
    user,
    async login(payload, mode) {
      const data = await api(`/api/auth/${mode}`, { method: 'POST', body: payload });
      localStorage.setItem('creatoros.token', data.token);
      localStorage.setItem('creatoros.user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    },
    logout() {
      localStorage.removeItem('creatoros.token');
      localStorage.removeItem('creatoros.user');
      setToken('');
      setUser(null);
    }
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
