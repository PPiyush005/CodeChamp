import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { getRevisionList } from '../../api/dsaAPI';
import { ExternalLink } from 'lucide-react';
import './ListPage.css';

const RevisionPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevisionList().then(data => {
      setItems(data);
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
      <div className="list-page">
        <div className="dsa-header">
          <div>
            <h1>Revision List</h1>
            <p>{items.length} questions to review</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card empty-state">
            <span className="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </span>
            <h3>Nothing to revise</h3>
            <p>Mark questions as Revisit from Practice page</p>
          </div>
        ) : (
          <div className="list-card">
            {items.map(q => (
              <div key={q.id} className="list-row">
                <span className={`badge-${q.difficulty?.toLowerCase()}`}>
                  {q.difficulty}
                </span>
                <span
                  className="list-title"
                  onClick={() => window.open(q.leetcodeUrl, '_blank')}>
                  {q.questionTitle}
                  <ExternalLink
                    size={12}
                    strokeWidth={2}
                    color="var(--text-muted)"
                  />
                </span>
                <span className="list-topic">
                  {q.topicName}
                </span>
                {q.notes && (
                  <span className="list-note">
                    {q.notes}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RevisionPage;