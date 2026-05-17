import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Code2, Target, Map,
  FolderOpen, Bookmark, RefreshCw, User,
  Search, Bell, Settings, ChevronRight,
  Zap
} from 'lucide-react';
import './Layout.css';
import ReminderSettings from './ReminderSettings';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dsa', icon: Code2, label: 'Practice' },
  { path: '/blind75', icon: Target, label: 'Blind 75' },
  { path: '/roadmap', icon: Map, label: 'Roadmap' },
  { path: '/topics', icon: FolderOpen, label: 'Topics' },
  { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { path: '/revision', icon: RefreshCw, label: 'Revision' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showReminder, setShowReminder] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(n => n[0]).join('')
      .toUpperCase().slice(0, 2);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/dsa?search=${search}`);
    }
  };

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link to="/dashboard">
            <div className="logo-box">
              <Zap size={16} strokeWidth={2.5} />
            </div>
          </Link>
          <div className="logo-text">
            <span className="logo-name">CodeChamp</span>
            <span className="logo-tagline">
              TECHNICAL EXCELLENCE
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}>
                <Icon size={17} strokeWidth={1.75} />
                <span className="sidebar-label">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="daily-challenge-btn"
            onClick={() => navigate('/blind75')}>
            <Target size={15} strokeWidth={2} />
            <span>Daily Challenge</span>
          </button>
          <button
            className="icon-btn"
            title="Reminders"
            onClick={() => setShowReminder(true)}>
            <Bell size={17} strokeWidth={1.75} />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-area">

        {/* Top Navbar */}
        <header className="topnav">
          <div className="topnav-search">
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <nav className="topnav-links">
            <Link to="/dsa" className={`topnav-link ${isActive('/dsa') ? 'active' : ''}`}>
              Practice
            </Link>
            <Link to="/roadmap" className={`topnav-link ${isActive('/roadmap') ? 'active' : ''}`}>
              Roadmap
            </Link>
            <Link to="/profile" className={`topnav-link ${isActive('/profile') ? 'active' : ''}`}>
              Profile
            </Link>
          </nav>

          <div className="topnav-right">
            <button className="icon-btn" title="Notifications">
              <Bell size={17} strokeWidth={1.75} />
            </button>
            <button className="icon-btn" title="Settings">
              <Settings size={17} strokeWidth={1.75} />
            </button>
            <div
              className="user-avatar"
              onClick={handleLogout}
              title="Click to logout">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
          {showReminder && (
      <ReminderSettings
        onClose={() => setShowReminder(false)}
      />
    )}
    </div>
  );
};

export default Layout;