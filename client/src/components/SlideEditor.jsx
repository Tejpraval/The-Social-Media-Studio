import { Copy, Download, GripVertical, Image, Plus, RefreshCw, Save, Sparkles, Trash2 } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { layouts, styles } from '../lib/format.js';
import { exportSlide, exportZip } from '../lib/export.js';
import SlidePreview from './SlidePreview.jsx';

export default function SlideEditor({
  project,
  brand,
  slides,
  activeIndex,
  setActiveIndex,
  setSlides,
  onSave,
  onRegenerate,
  onRewrite
}) {
  const refs = useRef([]);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [exportState, setExportState] = useState('');
  const active = slides[activeIndex] || slides[0];

  const captionBundle = useMemo(() => {
    if (!project) return '';
    return `${project.caption}\n\n${(project.hashtags || []).join(' ')}`;
  }, [project]);

  function updateActive(patch) {
    setSlides(slides.map((slide, index) => index === activeIndex ? { ...slide, ...patch } : slide));
  }

  function updateAllStyle(style) {
    setSlides(slides.map((slide) => ({ ...slide, visualTheme: style })));
  }

  async function save() {
    setSaving(true);
    await onSave();
    setSaving(false);
  }

  function duplicateSlide() {
    const clone = { ...active, _id: undefined, heading: `${active.heading} (copy)` };
    const next = [...slides.slice(0, activeIndex + 1), clone, ...slides.slice(activeIndex + 1)]
      .map((slide, index) => ({ ...slide, index }));
    setSlides(next);
    setActiveIndex(activeIndex + 1);
  }

  function deleteSlide() {
    if (slides.length === 1) return;
    const next = slides.filter((_, index) => index !== activeIndex).map((slide, index) => ({ ...slide, index }));
    setSlides(next);
    setActiveIndex(Math.max(0, activeIndex - 1));
  }

  function addSlide() {
    const nextSlide = {
      index: slides.length,
      heading: 'New sharp idea',
      subtext: 'Keep this slide focused on one useful point.',
      visualTheme: project.style,
      layoutType: 'title-heavy',
      imagePrompt: '',
      imageUrl: '',
      background: ''
    };
    setSlides([...slides, nextSlide]);
    setActiveIndex(slides.length);
  }

  function reorderSlides(from, to) {
    if (from === null || from === to) return;
    const next = [...slides];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setSlides(next.map((slide, index) => ({ ...slide, index })));
    setActiveIndex(to);
    setDragIndex(null);
  }

  function smartAction(mode) {
    const transforms = {
      punchy: {
        heading: active.heading.replace(/[.!?]*$/, '!'),
        subtext: 'Sharper, faster, and built to stop the scroll.'
      },
      shorten: {
        heading: active.heading.split(' ').slice(0, 8).join(' '),
        subtext: active.subtext.split(' ').slice(0, 16).join(' ')
      },
      hook: {
        heading: `Nobody tells you this: ${active.heading.toLowerCase()}`,
        subtext: active.subtext
      },
      cta: {
        heading: 'Try this on your next post',
        subtext: 'Save the idea, apply the framework, and publish with one clear takeaway.'
      }
    };
    updateActive(transforms[mode]);
  }

  async function exportOne() {
    setExportState('Preparing your creative...');
    await exportSlide(refs.current[activeIndex], `creatoros-slide-${activeIndex + 1}.png`);
    setExportState('Your content is ready to post 🚀');
    setTimeout(() => setExportState(''), 2200);
  }

  async function exportAll() {
    setExportState('Preparing your creative...');
    await exportZip(refs.current.filter(Boolean), project.title);
    setExportState('Your content is ready to post 🚀');
    setTimeout(() => setExportState(''), 2200);
  }

  return (
    <div className="studio-grid">
      {exportState && (
        <div className="export-toast">
          <Sparkles size={18} />
          <span>{exportState}</span>
        </div>
      )}

      <aside className="slide-rail">
        <div className="rail-heading">
          <strong>Slides</strong>
          <button className="icon-btn" onClick={addSlide} title="Add slide" aria-label="Add slide"><Plus size={18} /></button>
        </div>
        {slides.map((slide, index) => (
          <button
            key={slide._id || `${slide.heading}-${index}`}
            className={`thumb ${index === activeIndex ? 'selected' : ''}`}
            onClick={() => setActiveIndex(index)}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => reorderSlides(dragIndex, index)}
          >
            <span className="drag-handle"><GripVertical size={14} /></span>
            <SlidePreview slide={slide} brand={brand} format={project.format} />
          </button>
        ))}
      </aside>

      <section className="canvas-stage">
        <div className="top-toolbar floating-toolbar">
          <div className="segmented">
            {styles.map((style) => (
              <button
                key={style}
                className={active.visualTheme === style ? 'active' : ''}
                onClick={() => updateAllStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>
          <div className="quick-actions">
            <button onClick={() => smartAction('punchy')}>Make more punchy</button>
            <button onClick={() => smartAction('shorten')}>Shorten text</button>
            <button onClick={() => smartAction('hook')}>Add storytelling hook</button>
            <button onClick={() => smartAction('cta')}>Improve CTA</button>
          </div>
          <div className="toolbar-actions">
            <button className="icon-text" onClick={() => onRegenerate(active)}><RefreshCw size={17} /> Regenerate</button>
            <button className="icon-text" onClick={save}><Save size={17} /> {saving ? 'Saving' : 'Save'}</button>
            <button className="icon-btn" onClick={exportOne} title="Export slide" aria-label="Export slide"><Download size={18} /></button>
            <button className="icon-btn" onClick={exportAll} title="Export carousel ZIP" aria-label="Export carousel ZIP"><Image size={18} /></button>
          </div>
        </div>
        <div className="preview-wrap">
          {slides.map((slide, index) => (
            <div className={index === activeIndex ? 'preview-active' : 'preview-hidden'} key={slide._id || index}>
              <SlidePreview
                ref={(node) => { refs.current[index] = node; }}
                slide={slide}
                brand={brand}
                format={project.format}
                active={index === activeIndex}
              />
            </div>
          ))}
        </div>
      </section>

      <aside className="properties-panel">
        <div className="panel-heading">
          <h3>Edit Slide</h3>
          <div className="inline-actions">
            <button className="icon-btn" onClick={duplicateSlide} title="Duplicate slide" aria-label="Duplicate slide"><Copy size={17} /></button>
            <button className="icon-btn danger" onClick={deleteSlide} title="Delete slide" aria-label="Delete slide"><Trash2 size={17} /></button>
          </div>
        </div>
        <label>
          Heading
          <textarea value={active.heading} onChange={(event) => updateActive({ heading: event.target.value })} rows={3} />
        </label>
        <label>
          Subtext
          <textarea value={active.subtext} onChange={(event) => updateActive({ subtext: event.target.value })} rows={4} />
        </label>
        <label>
          Layout
          <select value={active.layoutType} onChange={(event) => updateActive({ layoutType: event.target.value })}>
            {layouts.map((layout) => <option value={layout.value} key={layout.value}>{layout.label}</option>)}
          </select>
        </label>
        <label>
          Visual prompt
          <textarea value={active.imagePrompt} onChange={(event) => updateActive({ imagePrompt: event.target.value })} rows={3} />
        </label>
        <div className="rewrite-grid">
          <button onClick={() => onRewrite(active, 'simpler')}>Simpler</button>
          <button onClick={() => onRewrite(active, 'engaging')}>Engaging</button>
          <button onClick={() => onRewrite(active, 'formal')}>Formal</button>
        </div>
        <button className="wide-btn" onClick={() => navigator.clipboard.writeText(captionBundle)}>Copy caption + hashtags</button>
      </aside>
    </div>
  );
}
