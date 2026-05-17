import { useState, useEffect } from 'react';
import { getHeatmapData } from '../../api/dsaAPI';
import './Heatmap.css';

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState({});
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    getHeatmapData().then(data => {
      setHeatmapData(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getLast365Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().substring(0, 10));
    }
    return days;
  };

  const getColor = (count) => {
    if (!count || count === 0) return 'var(--heatmap-empty)';
    if (count === 1) return 'var(--heatmap-1)';
    if (count === 2) return 'var(--heatmap-2)';
    if (count <= 4) return 'var(--heatmap-3)';
    return 'var(--heatmap-4)';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const days = getLast365Days();

  const weeks = [];
  let week = [];
  const firstDay = new Date(days[0]).getDay();
  for (let i = 0; i < firstDay; i++) {
    week.push(null);
  }
  days.forEach(day => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const months = [];
  let lastMonth = null;
  weeks.forEach((week, weekIdx) => {
    const firstValidDay = week.find(d => d !== null);
    if (firstValidDay) {
      const month = new Date(firstValidDay)
        .toLocaleDateString('en-US', { month: 'short' });
      if (month !== lastMonth) {
        months.push({ month, weekIdx });
        lastMonth = month;
      }
    }
  });

  const totalSolved = Object.values(heatmapData)
    .reduce((a, b) => a + b, 0);

  const activeDays = Object.keys(heatmapData).length;

  if (loading) return (
    <div className="heatmap-loading">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="heatmap-card card">
      <div className="heatmap-header">
        <h2>Solving Activity</h2>
        <div className="heatmap-summary">
          <span>
            <strong>{totalSolved}</strong> solutions
          </span>
          <span>
            <strong>{activeDays}</strong> active days
          </span>
          <span>in the last year</span>
        </div>
      </div>

      <div className="heatmap-container">
        <div className="heatmap-months">
          {months.map((m, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${m.weekIdx * 14}px`,
                fontSize: '0.7rem',
                color: 'var(--text-muted)'
              }}>
              {m.month}
            </span>
          ))}
        </div>

        <div className="heatmap-grid">
          <div className="heatmap-days-label">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="heatmap-weeks">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="heatmap-week">
                {week.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className="heatmap-cell"
                    style={{
                      background: day
                        ? getColor(heatmapData[day] || 0)
                        : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (day) {
                        setTooltip({
                          date: formatDate(day),
                          count: heatmapData[day] || 0,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="heatmap-legend">
          <span>Less</span>
          <div className="heatmap-cell"
            style={{background: 'var(--heatmap-empty)'}}>
          </div>
          <div className="heatmap-cell"
            style={{background: 'var(--heatmap-1)'}}>
          </div>
          <div className="heatmap-cell"
            style={{background: 'var(--heatmap-2)'}}>
          </div>
          <div className="heatmap-cell"
            style={{background: 'var(--heatmap-3)'}}>
          </div>
          <div className="heatmap-cell"
            style={{background: 'var(--heatmap-4)'}}>
          </div>
          <span>More</span>
        </div>
      </div>

      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y - 40,
            zIndex: 1000
          }}>
          <strong>{tooltip.count} solved</strong>
          <span>{tooltip.date}</span>
        </div>
      )}
    </div>
  );
};

export default Heatmap;