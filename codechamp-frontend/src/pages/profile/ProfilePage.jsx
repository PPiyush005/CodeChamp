import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { getProfile } from '../../api/dsaAPI';
import { Flame } from 'lucide-react';
import {
  BarChart2, Type, Link2, Layers, ArrowLeftRight,
  GitBranch, Share2, Cpu, Lightbulb, RotateCcw,
  CornerDownLeft, Search, Hash, Triangle, SortAsc
} from 'lucide-react';
import './ProfilePage.css';

const TOPIC_ICONS = {
  'Arrays': BarChart2,
  'Strings': Type,
  'Linked List': Link2,
  'Stack': Layers,
  'Queue': ArrowLeftRight,
  'Trees': GitBranch,
  'Graphs': Share2,
  'Dynamic Programming': Cpu,
  'Greedy': Lightbulb,
  'Recursion': RotateCcw,
  'Backtracking': CornerDownLeft,
  'Binary Search': Search,
  'Hashing': Hash,
  'Heap': Triangle,
  'Sorting': SortAsc
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then(data => {
      setProfile(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0])
      .join('').toUpperCase().slice(0, 2);
  };

  const getBadge = (solved) => {
    if (solved >= 150) return { label: 'Champion', color: '#d97706' };
    if (solved >= 75) return { label: 'Warrior', color: '#7c3aed' };
    if (solved >= 25) return { label: 'Explorer', color: '#2563eb' };
    return { label: 'Beginner', color: '#16a34a' };
  };

  if (loading) return (
    <Layout>
      <div className="page-loading" style={{minHeight:'60vh'}}>
        <div className="spinner"></div>
      </div>
    </Layout>
  );

  const badge = getBadge(profile?.solvedQuestions || 0);

  return (
    <Layout>
      <div className="profile-page">

        <div className="card profile-hero">
          <div className="profile-avatar-box">
            {getInitials(profile?.name)}
          </div>
          <div className="profile-hero-info">
            <div className="profile-name-line">
              <h1>{profile?.name}</h1>
              <span
                className="profile-badge-pill"
                style={{borderColor: badge.color, color: badge.color}}>
                {badge.label}
              </span>
            </div>
            <p className="profile-email">{profile?.email}</p>
            <p className="profile-since">
              Member since{' '}
              {profile?.joinedAt
                ? new Date(profile.joinedAt).toLocaleDateString('en-US', {
                    month: 'long', year: 'numeric'
                  })
                : '—'}
            </p>
          </div>
          <div className="profile-streak-box">
            <Flame size={24} color="var(--hard)" strokeWidth={1.75} />
            <span className="streak-num">
              {profile?.currentStreak || 0}
            </span>
            <span className="streak-label">Day Streak</span>
          </div>
        </div>

        <div className="profile-stats">
          {[
            { label: 'TOTAL', value: profile?.totalQuestions || 0, color: 'var(--primary)' },
            { label: 'SOLVED', value: profile?.solvedQuestions || 0, color: 'var(--easy)' },
            { label: 'EASY', value: profile?.easySolved || 0, color: 'var(--easy)' },
            { label: 'MEDIUM', value: profile?.mediumSolved || 0, color: 'var(--medium)' },
            { label: 'HARD', value: profile?.hardSolved || 0, color: 'var(--hard)' },
            { label: 'REVISIT', value: profile?.revisitQuestions || 0, color: 'var(--medium)' }
          ].map(s => (
            <div key={s.label} className="card profile-stat-card">
              <span className="pstat-num" style={{color: s.color}}>
                {s.value}
              </span>
              <span className="pstat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="rd-progress-header">
            <span style={{fontWeight:'700'}}>Overall Completion</span>
            <span style={{fontWeight:'700', color:'var(--primary)'}}>
              {profile?.completionPercentage || 0}%
            </span>
          </div>
          <div className="progress-track" style={{marginTop:'0.75rem'}}>
            <div
              className="progress-fill"
              style={{width:`${profile?.completionPercentage || 0}%`}}>
            </div>
          </div>
          <p style={{fontSize:'0.8rem', color:'var(--text-muted)',
            marginTop:'0.5rem'}}>
            {profile?.solvedQuestions || 0} of{' '}
            {profile?.totalQuestions || 0} questions solved
          </p>
        </div>

        <div className="profile-two-col">
          <div className="card">
            <h2 className="section-title">Topic Mastery</h2>
            <div className="mastery-list">
              {profile?.topicMastery?.map(t => {
                const Icon = TOPIC_ICONS[t.topicName];
                return (
                  <div key={t.topicName} className="mastery-row">
                    <span className="mastery-icon">
                      {Icon && (
                        <Icon size={14} strokeWidth={1.75}
                          color="var(--primary)" />
                      )}
                    </span>
                    <span className="mastery-name">
                      {t.topicName}
                    </span>
                    <div className="mastery-bar-wrap">
                      <div className="progress-track" style={{flex:1}}>
                        <div
                          className="progress-fill"
                          style={{width:`${t.percentage}%`}}>
                        </div>
                      </div>
                    </div>
                    <span className="mastery-pct">{t.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Recent Activity</h2>
            {!profile?.recentActivity?.length ? (
              <div className="empty-state">
                <span className="empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24"
                    fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <h3>No activity yet</h3>
                <p>Start solving questions!</p>
              </div>
            ) : (
              <div className="activity-feed">
                {profile.recentActivity.map((a, i) => (
                  <div key={i} className="activity-row">
                    <span className={`badge-${a.difficulty?.toLowerCase()}`}>
                      {a.difficulty}
                    </span>
                    <div className="activity-info">
                      <p className="activity-name">
                        {a.questionTitle}
                      </p>
                      <p className="activity-topic">
                        {a.topicName}
                      </p>
                    </div>
                    <span className="activity-date">
                      {a.solvedAt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;