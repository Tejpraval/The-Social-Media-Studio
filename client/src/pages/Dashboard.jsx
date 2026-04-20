import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, WandSparkles } from 'lucide-react';
import { api } from '../lib/api.js';
import { formatSizes, styles } from '../lib/format.js';

const starterIdeas = [
  'Explain why kids forget math using the forgetting curve, end with a simple review system',
  'Show startup founders why busy dashboards create slower decisions',
  'Teach beginner creators how to turn one insight into a carousel'
];

const generationStages = ['Understanding idea...', 'Building narrative...', 'Designing slides...'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [roughIdea, setRoughIdea] = useState(starterIdeas[0]);
  const [format, setFormat] = useState('carousel');
  const [style, setStyle] = useState('educational');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    api('/api/projects').then((data) => setProjects(data.projects)).catch(() => {});
  }, []);

  async function generate() {
    setLoading(true);
    setError('');
    setStageIndex(0);
    const stageTimer = setInterval(() => {
      setStageIndex((index) => Math.min(index + 1, generationStages.length - 1));
    }, 850);
    try {
      const data = await api('/api/projects/generate', {
        method: 'POST',
        body: { roughIdea, format, style }
      });
      setStageIndex(generationStages.length - 1);
      setTimeout(() => navigate(`/studio/${data.project._id}`), 650);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(stageTimer);
      setTimeout(() => setLoading(false), 650);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Idea to editable creative</p>
          <h1>Build a publish-ready social asset from a rough thought.</h1>
        </div>
      </header>

      <section className="generator-panel">
        <div className="idea-input">
          {loading && (
            <div className="generation-overlay">
              <strong>{generationStages[stageIndex]}</strong>
              <div className="loader-track"><span style={{ width: `${(stageIndex + 1) * 33.4}%` }} /></div>
              <small>Revealing your creative system...</small>
            </div>
          )}
          <textarea value={roughIdea} onChange={(event) => setRoughIdea(event.target.value)} />
          <div className="chips">
            {starterIdeas.map((idea) => (
              <button key={idea} onClick={() => setRoughIdea(idea)}>{idea}</button>
            ))}
          </div>
        </div>
        <div className="generate-controls">
          <label>
            Format
            <select value={format} onChange={(event) => setFormat(event.target.value)}>
              {Object.entries(formatSizes).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
            </select>
          </label>
          <label>
            Style
            <select value={style} onChange={(event) => setStyle(event.target.value)}>
              {styles.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-btn" onClick={generate} disabled={loading || roughIdea.length < 8}>
            <WandSparkles size={18} /> {loading ? 'Designing...' : 'Generate Creative'}
          </button>
        </div>
      </section>

      <section className="recent-section">
        <div className="panel-heading">
          <h2>Recent Projects</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <button className="project-card" key={project._id} onClick={() => navigate(`/studio/${project._id}`)}>
              <span>{project.format}</span>
              <strong>{project.title}</strong>
              <small>{new Date(project.updatedAt).toLocaleDateString()}</small>
              <ArrowRight size={18} />
            </button>
          ))}
          {!projects.length && <p className="empty-state">Your generated creatives will appear here.</p>}
        </div>
      </section>
    </div>
  );
}
