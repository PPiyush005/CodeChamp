import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getAllTracksProgress } from '../../api/roadmapAPI';
import { ArrowRight } from 'lucide-react';
import './RoadmapPage.css';

const TRACK_ICONS = {
  'Web Development': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="var(--primary)" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  'Java Full Stack': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="var(--primary)" strokeWidth="1.75">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  'Android Development': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="var(--primary)" strokeWidth="1.75">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  )
};

const RoadmapPage = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllTracksProgress().then(data => {
      setTracks(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <Layout>
      <div className="page-loading" style={{minHeight:'60vh'}}>
        <div className="spinner"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="roadmap-page">
        <div className="dsa-header">
          <div>
            <h1>Roadmap</h1>
            <p>Choose a learning path and track your progress</p>
          </div>
        </div>

        <div className="tracks-grid">
          {tracks.map(track => (
            <div
              key={track.trackId}
              className="track-card"
              onClick={() => navigate(`/roadmap/${track.trackId}`)}>
              <div className="track-card-top">
                <div className="track-icon-box">
                  {TRACK_ICONS[track.trackName] || (
                    <svg width="28" height="28" viewBox="0 0 24 24"
                      fill="none" stroke="var(--primary)" strokeWidth="1.75">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                  )}
                </div>
                <span className="track-weeks">
                  ~{track.estimatedWeeks} weeks
                </span>
              </div>
              <h3 className="track-name">{track.trackName}</h3>
              <p className="track-desc">{track.description}</p>
              <div className="track-progress-section">
                <div className="track-progress-labels">
                  <span>Progress</span>
                  <span className="track-pct">
                    {track.progressPercentage}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{width: `${track.progressPercentage}%`}}>
                  </div>
                </div>
                <span className="track-steps-count">
                  {track.completedSteps}/{track.totalSteps} steps completed
                </span>
              </div>
              <button className="track-action-btn">
                {track.completedSteps > 0 ? 'Continue' : 'Start Learning'}
                <ArrowRight size={15} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RoadmapPage;