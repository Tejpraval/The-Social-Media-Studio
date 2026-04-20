import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function BrandSettings() {
  const [brand, setBrand] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api('/api/brand').then((data) => setBrand(data.brand));
  }, []);

  if (!brand) return <div className="loading">Loading brand...</div>;

  function update(path, value) {
    if (path.startsWith('colors.')) {
      const index = Number(path.split('.')[1]);
      const colors = [...brand.colors];
      colors[index] = value;
      setBrand({ ...brand, colors });
      return;
    }
    if (path.startsWith('fonts.')) {
      const key = path.split('.')[1];
      setBrand({ ...brand, fonts: { ...brand.fonts, [key]: value } });
      return;
    }
    setBrand({ ...brand, [path]: value });
  }

  async function save() {
    await api('/api/brand', { method: 'PUT', body: brand });
    setStatus('Brand saved');
    setTimeout(() => setStatus(''), 1800);
  }

  return (
    <div className="page brand-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Brand consistency engine</p>
          <h1>Set the colors, fonts, and voice applied to every creative.</h1>
        </div>
        <button className="primary-btn" onClick={save}>Save Brand</button>
      </header>
      {status && <p className="save-status">{status}</p>}

      <section className="brand-layout">
        <div className="brand-form">
          <label>
            Brand name
            <input value={brand.name} onChange={(event) => update('name', event.target.value)} />
          </label>
          <div className="color-grid">
            {brand.colors.map((color, index) => (
              <label key={`${color}-${index}`}>
                Color {index + 1}
                <input type="color" value={color} onChange={(event) => update(`colors.${index}`, event.target.value)} />
              </label>
            ))}
          </div>
          <label>
            Heading font
            <input value={brand.fonts.heading} onChange={(event) => update('fonts.heading', event.target.value)} />
          </label>
          <label>
            Body font
            <input value={brand.fonts.body} onChange={(event) => update('fonts.body', event.target.value)} />
          </label>
          <label>
            Tone of voice
            <textarea value={brand.toneOfVoice} onChange={(event) => update('toneOfVoice', event.target.value)} rows={4} />
          </label>
        </div>
        <div className="brand-preview" style={{
          '--ink': brand.colors[0],
          '--accent': brand.colors[1],
          '--support': brand.colors[2],
          '--paper': brand.colors[3],
          '--heading-font': brand.fonts.heading,
          '--body-font': brand.fonts.body
        }}>
          <span>{brand.name}</span>
          <h2>Brand-consistent by default</h2>
          <p>{brand.toneOfVoice}</p>
          <div className="preview-bars"><i /><i /><i /></div>
        </div>
      </section>
    </div>
  );
}
