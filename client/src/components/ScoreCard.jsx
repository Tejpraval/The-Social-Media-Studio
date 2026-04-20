import React from 'react';

export default function ScoreCard({ intelligence }) {
  const metrics = [
    ['Hook', intelligence?.hookStrength || 0],
    ['Readability', intelligence?.readability || 0],
    ['Engagement', intelligence?.engagementPrediction || 0]
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
      <div className="suggestions">
        {(intelligence?.suggestions || []).map((suggestion) => (
          <p key={suggestion}>{suggestion}</p>
        ))}
      </div>
    </section>
  );
}
