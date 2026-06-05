import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Code2, Target, Map,
  FolderOpen, Bookmark, RefreshCw, 
  Zap, Bell, LogOut, Menu, X, Trophy
} from 'lucide-react';
import ReminderSettings from './ReminderSettings';
import './Layout.css';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dsa', icon: Code2, label: 'Practice' },
  { path: '/blind75', icon: Target, label: 'Blind 75' },
  { path: '/roadmap', icon: Map, label: 'Roadmap' },
  { path: '/topics', icon: FolderOpen, label: 'Topics' },
  { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { path: '/revision', icon: RefreshCw, label: 'Revision' },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0])
      .join('').toUpperCase().slice(0, 2);
  };

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Logo + Hamburger Row */}
        <div className="sidebar-logo">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen
              ? <X size={20} strokeWidth={2} />
              : <Menu size={20} strokeWidth={2} />}
          </button>

          {sidebarOpen && (
            <>
              <Link to="/dashboard" onClick={handleNavClick}>
                <div className="logo-box">
                  <Zap size={15} strokeWidth={2.5} />
                </div>
              </Link>
              <div className="logo-text">
                <span className="logo-name">CodeChamp</span>
                <span className="logo-tagline">
                  TECHNICAL EXCELLENCE
                </span>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                title={!sidebarOpen ? item.label : ''}>
                <Icon size={18} strokeWidth={1.75} />
                {sidebarOpen && (
                  <span className="sidebar-label">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        {sidebarOpen && (
          <div className="sidebar-bottom">

            {/* User Info */}
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {getInitials(user?.name)}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">
                  {user?.name}
                </span>
                <span className="sidebar-user-email">
                  {user?.email}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sidebar-actions">
              <button
                className="sidebar-action-btn"
                onClick={() => {
                  setShowReminder(true);
                  setSidebarOpen(false);
                }}
                title="Reminders">
                <Bell size={15} strokeWidth={1.75} />
                <span>Reminders</span>
              </button>
              <button
                className="sidebar-action-btn logout"
                onClick={handleLogout}
                title="Logout">
                <LogOut size={15} strokeWidth={1.75} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsed bottom — just avatar */}
        {!sidebarOpen && (
        <div className="sidebar-collapsed-bottom">
          <div
            className="sidebar-avatar-small"
            title={`${user?.name} — View Profile`}
            onClick={() => navigate('/profile')}>
            {getInitials(user?.name)}
          </div>
        </div>
      )}
      </aside>

      {/* Main Content */}
      <div className={`main-area ${sidebarOpen ? 'pushed' : ''}`}>
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