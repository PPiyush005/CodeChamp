import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getTrackProgress, toggleStepComplete } from '../../api/roadmapAPI';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import './RoadmapDetailPage.css';

const PHASE_COLORS = {
  Beginner: '#16a34a',
  Intermediate: '#d97706',
  Advanced: '#dc2626'
};

const RoadmapDetailPage = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTrack(); }, [trackId]);

  const fetchTrack = async () => {
    try {
      const data = await getTrackProgress(trackId);
      setTrack(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = async (stepId) => {
    try {
      const updated = await toggleStepComplete(stepId);
      setTrack(prev => ({
        ...prev,
        steps: prev.steps.map(s =>
          s.stepId === stepId
            ? { ...s, isCompleted: updated.isCompleted }
            : s
        ),
        completedSteps: updated.isCompleted
          ? prev.completedSteps + 1
          : prev.completedSteps - 1
      }));
      toast.success(updated.isCompleted ? 'Step completed!' : 'Step undone');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  if (loading) return (
    <Layout>
      <div className="page-loading" style={{minHeight:'60vh'}}>
        <div className="spinner"></div>
      </div>
    </Layout>
  );

  const phases = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <Layout>
      <div className="roadmap-detail">

        <button className="back-link" onClick={() => navigate('/roadmap')}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Roadmaps
        </button>

        <div className="rd-header card">
          <div className="rd-header-left">
            <h1>{track?.trackName}</h1>
            <p>{track?.description}</p>
          </div>
          <div className="rd-stats">
            <div className="rd-stat">
              <span className="rd-stat-num">{track?.completedSteps}</span>
              <span className="rd-stat-label">Done</span>
            </div>
            <div className="rd-stat">
              <span className="rd-stat-num">{track?.totalSteps}</span>
              <span className="rd-stat-label">Total</span>
            </div>
            <div className="rd-stat">
              <span className="rd-stat-num">{track?.progressPercentage}%</span>
              <span className="rd-stat-label">Progress</span>
            </div>
            <div className="rd-stat">
              <span className="rd-stat-num">~{track?.estimatedWeeks}w</span>
              <span className="rd-stat-label">Duration</span>
            </div>
          </div>
        </div>

        <div className="card" style={{padding:'1.25rem 1.5rem'}}>
          <div className="rd-progress-header">
            <span style={{fontSize:'0.875rem', fontWeight:'600'}}>
              Overall Progress
            </span>
            <span style={{fontSize:'0.875rem', fontWeight:'700', color:'var(--primary)'}}>
              {track?.progressPercentage}%
            </span>
          </div>
          <div className="progress-track" style={{marginTop:'0.75rem'}}>
            <div className="progress-fill" style={{width:`${track?.progressPercentage}%`}}></div>
          </div>
        </div>

        {phases.map(phase => {
          const phaseSteps = track?.steps?.filter(s => s.phase === phase);
          if (!phaseSteps?.length) return null;
          const doneCnt = phaseSteps.filter(s => s.isCompleted).length;

          return (
            <div key={phase} className="phase-block">
              <div className="phase-title-row">
                <span className="phase-dot" style={{background: PHASE_COLORS[phase]}}></span>
                <h2 className="phase-title">{phase}</h2>
                <span className="phase-count">{doneCnt}/{phaseSteps.length} completed</span>
              </div>

              <div className="steps-list card" style={{padding:0}}>
                {phaseSteps.map(step => (
                  <div key={step.stepId} className={`step-row ${step.isCompleted ? 'completed' : ''}`}>

                    <div className="step-num">
                      {step.isCompleted ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--easy)" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <span>{step.stepOrder}</span>
                      )}
                    </div>

                    <div className="step-body">
                      <h4 className="step-title-text">{step.title}</h4>
                      <p className="step-desc-text">{step.description}</p>
                      {step.resourceUrl && (
                        <a href={step.resourceUrl} target="_blank" rel="noreferrer" className="step-resource-link">
                          <ExternalLink size={13} strokeWidth={2} />
                          View Resource
                        </a>
                      )}
                    </div>

                    <button
                      className={`step-btn ${step.isCompleted ? 'undo' : 'done'}`}
                      onClick={() => handleToggleStep(step.stepId)}>
                      {step.isCompleted ? 'Undo' : 'Mark Done'}
                    </button>

                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </Layout>
  );
};

export default RoadmapDetailPage;