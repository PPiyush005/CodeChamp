import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import {
  getAllQuestions, updateProgress,
  toggleBookmark, getUserProgress
} from '../../api/dsaAPI';
import {
  ExternalLink, Bookmark, BookmarkCheck,
  ChevronUp, ChevronDown, FileText
} from 'lucide-react';
import NotesModal from '../../components/common/NotesModal';
import toast from 'react-hot-toast';
import './Blind75Page.css';

const TOPIC_ORDER = [
  'Arrays', 'Strings', 'Linked List', 'Trees',
  'Binary Search', 'Heap', 'Dynamic Programming',
  'Graphs', 'Backtracking', 'Greedy', 'Stack', 'Hashing'
];

const Blind75Page = () => {
  const [questions, setQuestions] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [blind75Data, progressData] = await Promise.all([
        getAllQuestions({ blind75: 'true' }),
        getUserProgress()
      ]);
      const progressMap = {};
      progressData.forEach(p => {
        progressMap[p.questionId] = p;
      });
      setQuestions(blind75Data);
      setUserProgress(progressMap);
      const expanded = {};
      TOPIC_ORDER.forEach(t => { expanded[t] = true; });
      setExpandedTopics(expanded);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (questionId, status) => {
    try {
      const updated = await updateProgress(questionId, { status });
      setUserProgress(prev => ({ ...prev, [questionId]: updated }));
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleBookmark = async (questionId) => {
    try {
      const updated = await toggleBookmark(questionId);
      setUserProgress(prev => ({ ...prev, [questionId]: updated }));
      toast.success(updated.isBookmarked ? 'Bookmarked!' : 'Removed');
    } catch (err) {
      toast.error('Failed');
    }
  };

  const getStatus = (id) =>
    userProgress[id]?.status || 'UNSOLVED';

  const isBookmarked = (id) =>
    userProgress[id]?.isBookmarked || false;

  const getNotes = (questionId) =>
    userProgress[questionId]?.notes || '';

  const handleNoteSave = (questionId, updated) => {
    setUserProgress(prev => ({
      ...prev,
      [questionId]: updated
    }));
  };

  const toggleTopic = (topic) =>
    setExpandedTopics(prev => ({
      ...prev, [topic]: !prev[topic]
    }));

  const getTopicQs = (topic) =>
    questions.filter(q => q.topicName === topic);

  const totalSolved = questions.filter(
    q => getStatus(q.id) === 'SOLVED'
  ).length;

  if (loading) return (
    <Layout>
      <div className="page-loading" style={{minHeight:'60vh'}}>
        <div className="spinner"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="blind75-page">

        <div className="b75-header">
          <div>
            <h1>Blind 75</h1>
            <p>Essential FAANG interview questions</p>
          </div>
          <div className="card b75-progress-card">
            <div className="b75-ring-wrap">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="32"
                  fill="none" stroke="var(--border)" strokeWidth="7"/>
                <circle cx="40" cy="40" r="32"
                  fill="none" stroke="var(--primary)" strokeWidth="7"
                  strokeDasharray={`${(totalSolved / Math.max(questions.length, 1)) * 201} 201`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"/>
              </svg>
              <div className="b75-ring-text">
                <span className="b75-ring-num">{totalSolved}</span>
                <span className="b75-ring-total">/{questions.length}</span>
              </div>
            </div>
            <div>
              <p style={{fontWeight:'700', fontSize:'1rem'}}>
                {totalSolved} Solved
              </p>
              <p style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>
                {questions.length - totalSolved} remaining
              </p>
              <span className="b75-pct-badge">
                {questions.length > 0
                  ? Math.round((totalSolved / questions.length) * 100)
                  : 0}% done
              </span>
            </div>
          </div>
        </div>

        <div className="card" style={{padding:'1.25rem 1.5rem'}}>
          <div className="rd-progress-header">
            <span style={{fontSize:'0.875rem', fontWeight:'600'}}>
              Overall Progress
            </span>
            <span style={{fontSize:'0.875rem', fontWeight:'700',
              color:'var(--primary)'}}>
              {questions.length > 0
                ? Math.round((totalSolved / questions.length) * 100)
                : 0}%
            </span>
          </div>
          <div className="progress-track" style={{marginTop:'0.75rem'}}>
            <div
              className="progress-fill"
              style={{width: `${questions.length > 0
                ? (totalSolved / questions.length) * 100 : 0}%`}}>
            </div>
          </div>
        </div>

        {TOPIC_ORDER.map(topic => {
          const topicQs = getTopicQs(topic);
          if (!topicQs.length) return null;
          const solved = topicQs.filter(
            q => getStatus(q.id) === 'SOLVED'
          ).length;

          return (
            <div key={topic} className="b75-topic-block card"
              style={{padding:0}}>
              <div className="b75-topic-header"
                onClick={() => toggleTopic(topic)}>
                <div className="b75-topic-left">
                  <span className="b75-topic-name">{topic}</span>
                  <span className="b75-topic-badge">
                    {solved}/{topicQs.length}
                  </span>
                </div>
                <div className="b75-topic-right">
                  <div className="b75-mini-bar">
                    <div
                      className="b75-mini-fill"
                      style={{width: `${topicQs.length > 0
                        ? (solved / topicQs.length) * 100 : 0}%`}}>
                    </div>
                  </div>
                  {expandedTopics[topic]
                    ? <ChevronUp size={14} strokeWidth={2}
                        color="var(--text-muted)" />
                    : <ChevronDown size={14} strokeWidth={2}
                        color="var(--text-muted)" />
                  }
                </div>
              </div>

              {expandedTopics[topic] && (
                <div className="b75-questions">
                  {topicQs.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`b75-row ${getStatus(q.id) === 'SOLVED' ? 'solved' : ''}`}>
                      <span className="b75-num">{idx + 1}</span>
                      <span className="b75-status">
                        {getStatus(q.id) === 'SOLVED' ? (
                          <svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none"
                            stroke="var(--easy)" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : getStatus(q.id) === 'REVISIT' ? (
                          <svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none"
                            stroke="var(--medium)" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none"
                            stroke="var(--border)" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                          </svg>
                        )}
                      </span>
                      <span
                        className="b75-title"
                        onClick={() => window.open(q.leetcodeUrl, '_blank')}>
                        {q.title}
                        <ExternalLink size={12} strokeWidth={2}
                          color="var(--text-muted)" />
                      </span>
                      <span className={`badge-${q.difficulty?.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                      <div className="row-actions">
                        <select
                          className="status-select"
                          value={getStatus(q.id)}
                          onChange={e => handleStatusChange(
                            q.id, e.target.value
                          )}>
                          <option value="UNSOLVED">Unsolved</option>
                          <option value="SOLVED">Solved</option>
                          <option value="REVISIT">Revisit</option>
                        </select>
                        <button
                          className="bookmark-btn"
                          onClick={() => handleBookmark(q.id)}>
                          {isBookmarked(q.id)
                            ? <BookmarkCheck size={16} strokeWidth={2}
                                color="var(--primary)" />
                            : <Bookmark size={16} strokeWidth={1.75}
                                color="var(--text-muted)" />}
                        </button>
                        <button
                          className={`notes-btn ${getNotes(q.id) ? 'has-note' : ''}`}
                          onClick={() => setActiveNote(q)}
                          title={getNotes(q.id) ? 'Edit note' : 'Add note'}>
                          <FileText size={15} strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

      </div>

      {activeNote && (
        <NotesModal
          question={activeNote}
          existingNote={getNotes(activeNote.id)}
          onClose={() => setActiveNote(null)}
          onSave={handleNoteSave}
        />
      )}

    </Layout>
  );
};

export default Blind75Page;