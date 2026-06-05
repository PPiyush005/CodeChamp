import useDarkMode from '../../utils/useDarkMode';
import { Sun, Moon } from 'lucide-react';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      {isDark
        ? <Sun size={18} strokeWidth={1.75} />
        : <Moon size={18} strokeWidth={1.75} />
      }
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default DarkModeToggle;