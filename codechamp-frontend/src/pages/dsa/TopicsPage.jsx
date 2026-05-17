import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getAllTopics, getDashboardStats } from '../../api/dsaAPI';
import './TopicsPage.css';
import {
  BarChart2, Type, Link2, Layers, ArrowLeftRight,
  GitBranch, Share2, Cpu, Lightbulb, RotateCcw,
  CornerDownLeft, Search, Hash, Triangle, SortAsc
} from 'lucide-react';

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

const TOPIC_TAGS = {
  'Arrays': ['Data Structure', 'Fundamental'],
  'Strings': ['Data Structure', 'Fundamental'],
  'Linked List': ['Linear', 'Intermediate'],
  'Stack': ['Linear', 'Fundamental'],
  'Queue': ['Linear', 'Fundamental'],
  'Trees': ['Non-Linear', 'Intermediate'],
  'Graphs': ['Non-Linear', 'Complex'],
  'Dynamic Programming': ['Algorithm', 'Advanced'],
  'Greedy': ['Algorithm', 'Advanced'],
  'Recursion': ['Algorithm', 'Intermediate'],
  'Backtracking': ['Algorithm', 'Advanced'],
  'Binary Search': ['Algorithm', 'Intermediate'],
  'Hashing': ['Data Structure', 'Intermediate'],
  'Heap': ['Data Structure', 'Advanced'],
  'Sorting': ['Algorithm', 'Fundamental']
};

const TopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [topicProgress, setTopicProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [topicsData, statsData] = await Promise.all([
        getAllTopics(),
        getDashboardStats()
      ]);
      setTopics(topicsData);
      const progressMap = {};
      statsData.topicProgressList?.forEach(tp => {
        progressMap[tp.topicName] = tp;
      });
      setTopicProgress(progressMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-loading" style={{minHeight:'60vh'}}>
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="topics-page">
        <div className="dsa-header">
          <div>
            <h1>Topics</h1>
            <p>Browse questions by category</p>
          </div>
        </div>

        <div className="topics-grid">
          {topics.map(topic => {
            const progress = topicProgress[topic.name] || {};
            const percentage = progress.percentage || 0;
            const solved = progress.solvedQuestions || 0;
            const total = progress.totalQuestions || 0;
            const tags = TOPIC_TAGS[topic.name] || ['Topic'];
            const Icon = TOPIC_ICONS[topic.name];

            return (
              <div
                key={topic.id}
                className="topic-card"
                onClick={() => navigate(`/dsa?topic=${topic.name}`)}>
                <div className="topic-card-top">
                  <div className="topic-icon-box">
                    {Icon && (
                      <Icon
                        size={18}
                        strokeWidth={1.75}
                        color="var(--primary)"
                      />
                    )}
                  </div>
                  <span className="topic-pct">{percentage}%</span>
                </div>
                <h3 className="topic-card-name">{topic.name}</h3>
                <div className="progress-track"
                  style={{margin: '0.75rem 0 0.4rem'}}>
                  <div
                    className="progress-fill"
                    style={{width: `${percentage}%`}}>
                  </div>
                </div>
                <div className="topic-card-bottom">
                  <div className="topic-tags">
                    {tags.map(tag => (
                      <span key={tag} className="topic-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="topic-solved-count">
                    {solved}/{total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default TopicsPage;