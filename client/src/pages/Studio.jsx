import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import SlideEditor from '../components/SlideEditor.jsx';
import ScoreCard from '../components/ScoreCard.jsx';

export default function Studio() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [slides, setSlides] = useState([]);
  const [brand, setBrand] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    Promise.all([
      api(`/api/projects/${projectId}`),
      api('/api/brand')
    ]).then(([projectData, brandData]) => {
      setProject(projectData.project);
      setSlides(projectData.slides);
      setBrand(brandData.brand);
    });
  }, [projectId]);

  async function saveSlides() {
    const data = await api(`/api/projects/${projectId}/slides`, {
      method: 'PUT',
      body: { slides }
    });
    setProject(data.project);
    setSlides(data.slides);
    setStatus('Saved');
    setTimeout(() => setStatus(''), 1800);
  }

  async function regenerate(slide) {
    const data = await api(`/api/projects/${projectId}/regenerate-slide/${slide._id}`, {
      method: 'POST',
      body: { style: slide.visualTheme, layoutType: slide.layoutType }
    });
    setSlides(slides.map((item) => item._id === slide._id ? data.slide : item));
  }

  async function rewrite(slide, mode) {
    const data = await api(`/api/projects/${projectId}/rewrite-slide/${slide._id}`, {
      method: 'POST',
      body: { mode }
    });
    setSlides(slides.map((item) => item._id === slide._id ? data.slide : item));
  }

  function fixActiveSlide() {
    const active = slides[activeIndex];
    setSlides(slides.map((slide, index) => index === activeIndex ? {
      ...slide,
      heading: active.heading.split(' ').slice(0, 8).join(' '),
      subtext: active.subtext.split(' ').slice(0, 18).join(' '),
      layoutType: active.layoutType === 'title-heavy' ? 'split-text-image' : active.layoutType
    } : slide));
    setStatus('Slide improved');
    setTimeout(() => setStatus(''), 1800);
  }

  if (!project || !brand) return <div className="loading">Loading studio...</div>;

  return (
    <div className="studio-page">
      <header className="studio-header">
        <div>
          <p className="eyebrow">{project.format} / {project.style}</p>
          <h1>{project.title}</h1>
        </div>
        <span className="save-status">{status}</span>
      </header>

      <div className="narrative-strip">
        <strong>{project.narrative?.hook}</strong>
        <span>{project.narrative?.targetAudience}</span>
        <span>{project.narrative?.tone}</span>
      </div>

      <SlideEditor
        project={project}
        brand={brand}
        slides={slides}
        setSlides={setSlides}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        onSave={saveSlides}
        onRegenerate={regenerate}
        onRewrite={rewrite}
      />

      <div className="studio-bottom">
        <ScoreCard intelligence={project.intelligence} onFix={fixActiveSlide} />
        <section className="caption-panel">
          <h3>Caption + Hashtags</h3>
          <p>{project.caption}</p>
          <div className="hashtag-list">
            {project.hashtags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="cta-list">
            {project.ctas.map((cta) => <button key={cta}>{cta}</button>)}
          </div>
        </section>
      </div>
    </div>
  );
}
