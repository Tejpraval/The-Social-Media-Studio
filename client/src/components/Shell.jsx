import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut, Palette, Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';

export default function Shell() {
  const { logout, user } = useAuth();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand-mark" to="/">
          <span>CreatorOS</span>
        </Link>
        <nav>
          <NavLink to="/" end><Sparkles size={18} /> Studio</NavLink>
          <NavLink to="/brand"><Palette size={18} /> Brand</NavLink>
        </nav>
        <div className="sidebar-user">
          <div>
            <strong>{user?.name}</strong>
            <small>{user?.email}</small>
          </div>
          <button className="icon-btn" onClick={logout} title="Log out" aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="main-area">
        <Outlet />
      </main>
    </div>
  );
}
