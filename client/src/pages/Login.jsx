import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { demoBrand, demoSlides } from '../lib/demoCreative.js';
import SlidePreview from '../components/SlidePreview.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const demoIdea = 'Why kids forget math...';

  useEffect(() => {
    const interval = setInterval(() => setPreviewIndex((index) => (index + 1) % demoSlides.length), 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTyped(demoIdea.slice(0, index));
      index = index >= demoIdea.length ? 0 : index + 1;
    }, 95);
    return () => clearInterval(interval);
  }, []);

  const activePreview = useMemo(() => demoSlides[previewIndex], [previewIndex]);

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
        <div className="auth-product-story">
          <div className="flow-chip">Idea</div>
          <div className="typing-surface">
            <span>{typed}</span>
            <i />
          </div>
          <div className="flow-steps">
            <span>Idea</span>
            <ArrowRight size={16} />
            <span>Structured slides</span>
            <ArrowRight size={16} />
            <span>Designed output</span>
          </div>
          <div className={`live-carousel-preview login-preview-slide-${previewIndex + 1}`}>
            <SlidePreview slide={activePreview} brand={demoBrand} format="carousel" active />
          </div>
        </div>
        <div className="auth-copy">
          <Sparkles size={30} />
          <h1>Turn ideas into high-converting creatives</h1>
          <p>From thought to narrative to design to export. CreatorOS behaves like an intelligent creative partner, not another blank editor.</p>
        </div>
      </section>
      <form className="auth-card glass-card" onSubmit={submit}>
        <div className="login-card-heading">
          <span>CreatorOS</span>
          <h2>Enter your studio</h2>
          <p>From thought to narrative to design to export</p>
        </div>
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
        <button type="button" className="demo-btn" onClick={() => navigate('/demo')}>
          <Play size={17} /> Try demo
        </button>
      </form>
    </main>
  );
}
