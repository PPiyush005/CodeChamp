import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../api/dsaAPI';
import Layout from '../../components/common/Layout';
import DailyTest from '../../components/common/DailyTest';
import Heatmap from '../../components/common/Heatmap';
import {
  BookOpen, CheckCircle, RotateCcw, Flame,
  ArrowRight, Trophy, ChevronRight
} from 'lucide-react';
import './Dashboard.css';
import DarkModeToggle from '../../components/common/DarkModeToggle';


const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="page-loading" style={{minHeight:'60vh'}}>
        <div className="spinner"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="dashboard">

        {/* Welcome Banner */}
        <div className="welcome-banner">
  <div className="welcome-text">
    <h1>Welcome back, {user?.name}!</h1>
    <p>...</p>
  </div>
  <div className="welcome-banner-actions">
    <DarkModeToggle />
    <button
      className="btn-primary"
      onClick={() => navigate('/dsa')}>
      Continue Practicing
      <ArrowRight size={16} strokeWidth={2} />
    </button>
  </div>
</div>
        

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon-box">
                <BookOpen size={18} color="var(--primary)" strokeWidth={1.75} />
              </div>
              <span className="stat-label">TOTAL QUESTIONS</span>
            </div>
            <span className="stat-number">
              {stats?.totalQuestions?.toLocaleString() || 0}
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon-box">
                <CheckCircle size={18} color="var(--easy)" strokeWidth={1.75} />
              </div>
              <span className="stat-label">SOLVED</span>
            </div>
            <span className="stat-number">
              {stats?.solvedQuestions?.toLocaleString() || 0}
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon-box">
                <RotateCcw size={18} color="var(--medium)" strokeWidth={1.75} />
              </div>
              <span className="stat-label">TO REVISIT</span>
            </div>
            <span className="stat-number">
              {stats?.revisitQuestions || 0}
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon-box">
                <Flame size={18} color="var(--hard)" strokeWidth={1.75} />
              </div>
              <span className="stat-label">DAY STREAK</span>
            </div>
            <span className="stat-number">
              {String(stats?.currentStreak || 0).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="dashboard-bottom">

          {/* Progress Card */}
          <div className="card progress-card">
            <div className="progress-card-header">
              <h2>Overall Progress</h2>
              <span className="progress-pct">
                {stats?.completionPercentage || 0}% COMPLETED
              </span>
            </div>
            <div className="progress-track"
              style={{marginBottom: '1.5rem'}}>
              <div
                className="progress-fill"
                style={{width: `${stats?.completionPercentage || 0}%`}}>
              </div>
            </div>

    
    

            <div className="difficulty-row">
              <div className="diff-item">
                <span className="diff-label">EASY</span>
                <span className="diff-value"
                  style={{color: 'var(--easy)'}}>
                  {stats?.topicProgressList
                    ?.filter(t => ['Arrays','Strings',
                      'Linked List','Stack','Queue']
                      .includes(t.topicName))
                    ?.reduce((a,t) =>
                      a + t.totalQuestions, 0) || 0}
                </span>
              </div>
              <div className="diff-item">
                <span className="diff-label">MEDIUM</span>
                <span className="diff-value"
                  style={{color: 'var(--medium)'}}>
                  {stats?.topicProgressList
                    ?.filter(t => ['Trees','Graphs',
                      'Binary Search','Hashing']
                      .includes(t.topicName))
                    ?.reduce((a,t) =>
                      a + t.totalQuestions, 0) || 0}
                </span>
              </div>
              <div className="diff-item">
                <span className="diff-label">HARD</span>
                <span className="diff-value"
                  style={{color: 'var(--hard)'}}>
                  {stats?.topicProgressList
                    ?.filter(t => ['Dynamic Programming',
                      'Backtracking','Greedy']
                      .includes(t.topicName))
                    ?.reduce((a,t) =>
                      a + t.totalQuestions, 0) || 0}
                </span>
              </div>
            </div>

            <div className="topic-prof-header">
              <h2>Topic Proficiency</h2>
              <button
                className="view-all-btn"
                onClick={() => navigate('/topics')}>
                VIEW ALL
              </button>
            </div>

            <div className="topic-prof-grid">
              {stats?.topicProgressList?.slice(0,4)?.map(topic => (
                <div
                  key={topic.topicName}
                  className="topic-prof-card"
                  onClick={() => navigate(
                    `/dsa?topic=${topic.topicName}`
                  )}>
                  <div className="topic-prof-header-row">
                    <span className="topic-prof-name">
                      {topic.topicName}
                    </span>
                    <span className="topic-prof-pct">
                      {topic.percentage}%
                    </span>
                  </div>
                  <div className="progress-track"
                    style={{margin: '0.5rem 0'}}>
                    <div
                      className="progress-fill"
                      style={{width: `${topic.percentage}%`}}>
                    </div>
                  </div>
                  <div className="topic-tags">
                    <span className="topic-tag">
                      Data Structure
                    </span>
                    <span className="topic-tag">
                      {topic.percentage > 50 ? 'Advanced'
                        : topic.percentage > 25
                        ? 'Intermediate' : 'Beginner'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Test */}
          <DailyTest />
          <Heatmap />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;