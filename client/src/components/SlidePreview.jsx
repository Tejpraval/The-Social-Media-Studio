import React, { forwardRef } from 'react';

function AccentGraphic({ slide }) {
  if (slide.layoutType === 'infographic-style') {
    return (
      <div className="mini-chart">
        <span style={{ height: '42%' }} />
        <span style={{ height: '72%' }} />
        <span style={{ height: '55%' }} />
        <span style={{ height: '86%' }} />
      </div>
    );
  }
  if (slide.layoutType === 'quote-style') return <div className="quote-mark">"</div>;
  return <div className="visual-orbit"><span /><span /><span /></div>;
}

const SlidePreview = forwardRef(function SlidePreview({ slide, brand, format, active }, ref) {
  const colors = brand?.colors || ['#111827', '#f97316', '#14b8a6', '#f8fafc'];
  const style = {
    '--ink': colors[0],
    '--accent': colors[1],
    '--support': colors[2],
    '--paper': colors[3],
    '--heading-font': brand?.fonts?.heading || 'Inter',
    '--body-font': brand?.fonts?.body || 'Inter',
    background: slide.background || `linear-gradient(135deg, ${colors[3]}, #ffffff 55%, ${colors[1]}22)`
  };

  return (
    <article ref={ref} className={`slide-canvas ${format} ${slide.layoutType} ${active ? 'active' : ''}`} style={style}>
      <div className="slide-frame">
        <div className="slide-kicker">CreatorOS</div>
        <div className="slide-content">
          <div className="copy-block">
            <h2>{slide.heading}</h2>
            <p>{slide.subtext}</p>
          </div>
          <div className="visual-block" aria-hidden="true">
            {slide.imageUrl ? <img src={slide.imageUrl} alt="" /> : <AccentGraphic slide={slide} />}
            <AccentGraphic slide={slide} />
          </div>
        </div>
        <div className="slide-footer">
          <span>{String((slide.index ?? 0) + 1).padStart(2, '0')}</span>
          <span>{slide.visualTheme}</span>
        </div>
      </div>
    </article>
  );
});

export default SlidePreview;
