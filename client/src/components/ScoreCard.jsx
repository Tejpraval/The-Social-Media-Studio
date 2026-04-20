import React from 'react';

export default function ScoreCard({ intelligence, onFix }) {
  const metrics = [
    ['Hook', intelligence?.hookStrength || 0],
    ['Readability', intelligence?.readability || 0],
    ['Engagement', intelligence?.engagementPrediction || 0]
  ];
  const badges = [
    { label: '🔥 Strong hook', active: (intelligence?.hookStrength || 0) >= 80 },
    { label: '⚠️ Too text-heavy', active: (intelligence?.readability || 0) < 78 },
    { label: '💡 Improve clarity', active: (intelligence?.engagementPrediction || 0) < 84 }
  ];

  return (
    <section className="score-panel">
      <div className="panel-heading">
        <h3>Creative Intelligence</h3>
      </div>
      <div className="score-grid">
        {metrics.map(([label, value]) => (
          <div className="score-ring" key={label} style={{ '--score': `${value}%` }}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="intelligence-badges">
        {badges.map((badge) => (
          <span className={badge.active ? 'active' : ''} key={badge.label}>{badge.label}</span>
        ))}
      </div>
      <div className="suggestions">
        {(intelligence?.suggestions || []).map((suggestion) => (
          <p key={suggestion}>{suggestion}</p>
        ))}
      </div>
      {onFix && <button className="wide-btn fix-btn" onClick={onFix}>Fix it</button>}
    </section>
  );
}
