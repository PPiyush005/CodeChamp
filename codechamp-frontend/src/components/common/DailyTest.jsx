import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink, CheckCircle, Circle,
  Trophy, RotateCcw, ChevronRight
} from 'lucide-react';
import { getDailyTestQuestions, updateProgress, getUserProgress } from '../../api/dsaAPI';
import toast from 'react-hot-toast';
import './DailyTest.css';

const DailyTest = () => {
  const [questions, setQuestions] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [questionsData, progressData] =
        await Promise.all([
          getDailyTestQuestions(),
          getUserProgress()
        ]);
      setQuestions(questionsData);
      const progressMap = {};
      progressData.forEach(p => {
        progressMap[p.questionId] = p;
      });
      setUserProgress(progressMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (id) =>
    userProgress[id]?.status || 'UNSOLVED';

  const handleToggleSolved = async (question) => {
    const currentStatus = getStatus(question.id);
    const newStatus = currentStatus === 'SOLVED'
      ? 'UNSOLVED' : 'SOLVED';
    try {
      const updated = await updateProgress(
        question.id, { status: newStatus }
      );
      setUserProgress(prev => ({
        ...prev,
        [question.id]: updated
      }));
      if (newStatus === 'SOLVED') {
        toast.success('Question solved! +1 today');
      }
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const solvedToday = questions.filter(
    q => getStatus(q.id) === 'SOLVED'
  ).length;

  const allSolved = solvedToday === questions.length
    && questions.length > 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  if (loading) return (
    <div className="daily-test-card card">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="daily-test-card card">

      {/* Header */}
      <div className="dt-header">
        <div className="dt-header-left">
          <div className="dt-icon-box">
            <Trophy size={18} strokeWidth={1.75}
              color="var(--primary)" />
          </div>
          <div>
            <h2 className="dt-title">Daily Test</h2>
            <p className="dt-date">{today}</p>
          </div>
        </div>
        <div className="dt-header-right">
          <div className="dt-score">
            <span className="dt-score-num"
              style={{color: allSolved
                ? 'var(--easy)' : 'var(--primary)'}}>
              {solvedToday}
            </span>
            <span className="dt-score-total">
              /{questions.length}
            </span>
          </div>
          <button
            className="dt-toggle"
            onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${(solvedToday / questions.length) * 100}%`,
            background: allSolved
              ? 'var(--easy)' : 'var(--primary)'
          }}>
        </div>
      </div>

      {/* All Solved Message */}
      {allSolved && (
        <div className="dt-completed">
          <Trophy size={20} strokeWidth={1.75}
            color="var(--easy)" />
          <span>
            All done for today! Come back tomorrow
            for new questions.
          </span>
        </div>
      )}

      {/* Questions List */}
      {expanded && (
        <div className="dt-questions">
          {questions.map((q, idx) => {
            const solved = getStatus(q.id) === 'SOLVED';
            return (
              <div
                key={q.id}
                className={`dt-row ${solved ? 'solved' : ''}`}>
                <button
                  className="dt-check"
                  onClick={() => handleToggleSolved(q)}>
                  {solved
                    ? <CheckCircle size={20} strokeWidth={2}
                        color="var(--easy)" />
                    : <Circle size={20} strokeWidth={1.75}
                        color="var(--border)" />
                  }
                </button>
                <div className="dt-question-info">
                  <span
                    className={`dt-question-title ${solved ? 'done' : ''}`}
                    onClick={() => window.open(
                      q.leetcodeUrl, '_blank'
                    )}>
                    {idx + 1}. {q.title}
                    <ExternalLink size={11} strokeWidth={2}
                      color="var(--text-muted)" />
                  </span>
                  <span className="dt-question-meta">
                    {q.topicName}
                  </span>
                </div>
                <span className={`badge-${q.difficulty?.toLowerCase()}`}>
                  {q.difficulty}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
<div className="dt-footer-section">
  <div
    className="dt-challenge-btn"
    onClick={() => navigate('/mcq')}>
    <Trophy size={16} strokeWidth={1.75} />
    <div className="dt-challenge-text">
      <span className="dt-challenge-title">
        Take Full Challenge
      </span>
      <span className="dt-challenge-sub">
        10 MCQ questions · refreshes daily
      </span>
    </div>
    <ChevronRight size={16} strokeWidth={2}
      color="var(--primary)" />
  </div>
  <p className="dt-footer">
    New questions every day at midnight
  </p>
</div>
    </div>
  );
};

export default DailyTest;