import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import {
  getAllQuestions, getAllTopics, getAllPatterns,
  updateProgress, toggleBookmark, getUserProgress
} from '../../api/dsaAPI';
import toast from 'react-hot-toast';
import './DSAPage.css';
import { ExternalLink, Bookmark, BookmarkCheck, FileText } from 'lucide-react';
import NotesModal from '../../components/common/NotesModal';

const DSAPage = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [activeNote, setActiveNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      topic: params.get('topic') || '',
      difficulty: params.get('difficulty') || '',
      pattern: params.get('pattern') || '',
      search: params.get('search') || ''
    };
  });

  useEffect(() => { fetchInitialData(); }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      topic: params.get('topic') || '',
      difficulty: params.get('difficulty') || '',
      pattern: params.get('pattern') || '',
      search: params.get('search') || ''
    });
  }, [location.search]);

  useEffect(() => { fetchQuestions(); }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [topicsData, patternsData, progressData] =
        await Promise.all([
          getAllTopics(), getAllPatterns(), getUserProgress()
        ]);
      setTopics(topicsData);
      setPatterns(patternsData);
      const progressMap = {};
      progressData.forEach(p => {
        progressMap[p.questionId] = p;
      });
      setUserProgress(progressMap);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getAllQuestions(filters);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      toast.error('Failed to bookmark');
    }
  };

  const handleNoteSave = (questionId, updated) => {
  setUserProgress(prev => ({
    ...prev,
    [questionId]: updated
  }));
};

const getNotes = (questionId) =>
  userProgress[questionId]?.notes || '';
  const getStatus = (id) => userProgress[id]?.status || 'UNSOLVED';
  const isBookmarked = (id) => userProgress[id]?.isBookmarked || false;

  const clearFilters = () => setFilters({
    topic: '', difficulty: '', pattern: '', search: ''
  });

  const solvedCount = questions.filter(
    q => getStatus(q.id) === 'SOLVED'
  ).length;

  return (
    <Layout>
      <div className="dsa-page">

        <div className="dsa-header">
          <div>
            <h1>
              {filters.topic ? filters.topic : 'Practice'}
            </h1>
            <p>
              {solvedCount} solved out of{' '}
              {questions.length} questions
            </p>
          </div>
        </div>

        <div className="dsa-filters">
          <input
            type="text"
            placeholder="Search questions..."
            className="dsa-search"
            value={filters.search}
            onChange={e => handleFilterChange(
              'search', e.target.value
            )}
          />
          <select
            className="dsa-select"
            value={filters.topic}
            onChange={e => handleFilterChange(
              'topic', e.target.value
            )}>
            <option value="">All Topics</option>
            {topics.map(t => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            className="dsa-select"
            value={filters.difficulty}
            onChange={e => handleFilterChange(
              'difficulty', e.target.value
            )}>
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <select
            className="dsa-select"
            value={filters.pattern}
            onChange={e => handleFilterChange(
              'pattern', e.target.value
            )}>
            <option value="">All Patterns</option>
            {patterns.map(p => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          {(filters.topic || filters.difficulty ||
            filters.pattern || filters.search) && (
            <button
              className="clear-filters-btn"
              onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>

        <div className="dsa-table-card">
          <div className="dsa-table-header">
            <span>Status</span>
            <span>Title</span>
            <span>Topic</span>
            <span>Difficulty</span>
            <span>Pattern</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="dsa-loading">
              <div className="spinner"></div>
            </div>
          ) : questions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">
                <svg width="40" height="40"
                  viewBox="0 0 24 24" fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21"
                    x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <h3>No questions found</h3>
              <p>Try adjusting your filters</p>
              <button
                className="btn-primary"
                style={{marginTop: '1rem'}}
                onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            questions.map(q => (
              <div
                key={q.id}
                className={`dsa-row ${getStatus(q.id) === 'SOLVED' ? 'solved' : ''}`}>
                <span className="row-status-icon">
                  {getStatus(q.id) === 'SOLVED' ? (
                    <svg width="16" height="16"
                      viewBox="0 0 24 24" fill="none"
                      stroke="var(--easy)"
                      strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : getStatus(q.id) === 'REVISIT' ? (
                    <svg width="16" height="16"
                      viewBox="0 0 24 24" fill="none"
                      stroke="var(--medium)"
                      strokeWidth="2">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16"
                      viewBox="0 0 24 24" fill="none"
                      stroke="var(--border)"
                      strokeWidth="2">
                      <rect x="3" y="3" width="18"
                        height="18" rx="2"/>
                    </svg>
                  )}
                </span>
                <span
                  className="row-title"
                  onClick={() => window.open(
                    q.leetcodeUrl, '_blank'
                  )}>
                  {q.title}
                  <ExternalLink size={12} strokeWidth={2}
                    color="var(--text-muted)" />
                </span>
                <span className="row-topic">
                  {q.topicName}
                </span>
                <span className={`badge-${q.difficulty?.toLowerCase()}`}>
                  {q.difficulty}
                </span>
                <span className="row-pattern">
                  {q.patternName || '—'}
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
                      ? <BookmarkCheck size={16}
                          strokeWidth={2}
                          color="var(--primary)" />
                      : <Bookmark size={16}
                          strokeWidth={1.75}
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
            ))
          )}
        </div>
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

export default DSAPage;