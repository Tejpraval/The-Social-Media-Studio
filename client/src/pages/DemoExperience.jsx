import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import SlideEditor from '../components/SlideEditor.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import { demoBrand, demoProject, demoSlides } from '../lib/demoCreative.js';

const stages = ['Understanding idea...', 'Building narrative...', 'Designing slides...'];

function applyDemoRewrite(slide, mode) {
  const updates = {
    punchy: {
      heading: slide.heading.replace(/\.$/, '') + '!',
      subtext: 'A sharper version built for stopping the scroll.'
    },
    shorten: {
      heading: slide.heading.split(' ').slice(0, 7).join(' '),
      subtext: slide.subtext.split(' ').slice(0, 14).join(' ') + '.'
    },
    hook: {
      heading: `Nobody tells parents this: ${slide.heading.toLowerCase()}`,
      subtext: slide.subtext
    },
    cta: {
      heading: 'Try this before the next math lesson',
      subtext: 'Review once today, once tomorrow, and once next week.'
    }
  };
  return { ...slide, ...(updates[mode] || updates.punchy) };
}

export default function DemoExperience() {
  const [stageIndex, setStageIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [slides, setSlides] = useState(demoSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const timers = stages.map((_, index) => setTimeout(() => setStageIndex(index), index * 850));
    const readyTimer = setTimeout(() => setReady(true), 2850);
    return () => [...timers, readyTimer].forEach(clearTimeout);
  }, []);

  function saveDemo() {
    setStatus('Demo saved locally');
    setTimeout(() => setStatus(''), 1800);
  }

  function regenerate(slide) {
    setSlides((items) => items.map((item) => item.index === slide.index ? {
      ...item,
      heading: `Fresh angle: ${item.heading}`.slice(0, 120),
      visualTheme: item.visualTheme === 'viral' ? 'bold' : 'viral'
    } : item));
  }

  function rewrite(slide, mode) {
    setSlides((items) => items.map((item) => item.index === slide.index ? applyDemoRewrite(item, mode) : item));
  }

  return (
    <main className="demo-page">
      <header className="demo-header">
        <Link to="/login" className="back-link"><ArrowLeft size={18} /> Back</Link>
        <div>
          <p className="eyebrow">Instant demo</p>
          <h1>See an idea become an editable creative.</h1>
        </div>
        <Link to="/login" className="primary-btn">Create account</Link>
      </header>

      {!ready ? (
        <section className="magic-loader">
          <Sparkles size={38} />
          <h2>{stages[stageIndex]}</h2>
          <div className="loader-track"><span style={{ width: `${(stageIndex + 1) * 33.4}%` }} /></div>
          <p>Why kids forget math...</p>
        </section>
      ) : (
        <>
          <div className="demo-status-row">
            <span>{status || 'Generated demo carousel ready'}</span>
            <span>No login required</span>
          </div>
          <SlideEditor
            project={demoProject}
            brand={demoBrand}
            slides={slides}
            setSlides={setSlides}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onSave={saveDemo}
            onRegenerate={regenerate}
            onRewrite={rewrite}
          />
          <div className="studio-bottom">
            <ScoreCard intelligence={demoProject.intelligence} onFix={() => rewrite(slides[activeIndex], 'shorten')} />
            <section className="caption-panel">
              <h3>Demo Caption</h3>
              <p>{demoProject.caption}</p>
              <div className="hashtag-list">
                {demoProject.hashtags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
