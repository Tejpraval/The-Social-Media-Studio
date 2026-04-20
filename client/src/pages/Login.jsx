import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(mode === 'register' ? form : { email: form.email, password: form.password }, mode);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-art">
          <div className="mock-slide one">
            <span>Hook</span>
            <strong>Turn messy ideas into designed carousels</strong>
          </div>
          <div className="mock-slide two">
            <span>Insight</span>
            <strong>Narrative, visuals, brand, export</strong>
          </div>
        </div>
        <div className="auth-copy">
          <Sparkles size={30} />
          <h1>CreatorOS</h1>
          <p>Canva + ChatGPT + image direction in one focused social creative workflow.</p>
        </div>
      </section>
      <form className="auth-card" onSubmit={submit}>
        <div className="segmented full">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>
        {mode === 'register' && (
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-btn" disabled={loading}>{loading ? 'Working...' : 'Enter CreatorOS'}</button>
      </form>
    </main>
  );
}
