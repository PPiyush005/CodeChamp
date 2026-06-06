export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080/api/v1';

export const DIFFICULTY_COLORS = {
  EASY: '#4caf50',
  MEDIUM: '#ff9800',
  HARD: '#f44336'
};

export const STATUS_COLORS = {
  SOLVED: '#4caf50',
  REVISIT: '#ff9800',
  UNSOLVED: '#555577'
};

export const STATUS_LABELS = {
  SOLVED: 'Solved',
  REVISIT: 'Revisit',
  UNSOLVED: 'Unsolved'
};