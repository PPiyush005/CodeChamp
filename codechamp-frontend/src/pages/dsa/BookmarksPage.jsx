import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { getBookmarks } from '../../api/dsaAPI';
import { ExternalLink } from 'lucide-react';
import './ListPage.css';

const BookmarksPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks().then(data => {
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
            <h1>Bookmarks</h1>
            <p>{items.length} saved questions</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card empty-state">
            <span className="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            <h3>No bookmarks yet</h3>
            <p>Bookmark questions from the Practice page</p>
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
                <span className={`status-pill ${q.status?.toLowerCase()}`}>
                  {q.status}
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

export default BookmarksPage;