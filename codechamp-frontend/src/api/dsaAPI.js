import axiosInstance from './axiosInstance';

export const getAllTopics = async () => {
  const response = await axiosInstance
    .get('/topics');
  return response.data;
};

export const getAllQuestions = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.topic) params.append('topic', filters.topic);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.pattern) params.append('pattern', filters.pattern);
  if (filters.search) params.append('search', filters.search);
  if (filters.blind75) params.append('blind75', 'true');

  const response = await axiosInstance
    .get(`/questions?${params.toString()}`);
  return response.data;
};

export const getQuestionById = async (id) => {
  const response = await axiosInstance
    .get(`/questions/${id}`);
  return response.data;
};

export const getAllPatterns = async () => {
  const response = await axiosInstance
    .get('/patterns');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await axiosInstance
    .get('/progress/dashboard');
  return response.data;
};

export const updateProgress = async (questionId, data) => {
  const response = await axiosInstance
    .put(`/progress/questions/${questionId}`, data);
  return response.data;
};

export const toggleBookmark = async (questionId) => {
  const response = await axiosInstance
    .put(`/progress/questions/${questionId}/bookmark`);
  return response.data;
};

export const getUserProgress = async () => {
  const response = await axiosInstance
    .get('/progress/questions');
  return response.data;
};

export const getBookmarks = async () => {
  const response = await axiosInstance
    .get('/progress/bookmarks');
  return response.data;
};

export const getRevisionList = async () => {
  const response = await axiosInstance
    .get('/progress/revision');
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance
    .get('/profile');
  return response.data;
};

export const getHeatmapData = async () => {
  const response = await axiosInstance
    .get('/progress/heatmap');
  return response.data;
};

export const getDailyTestQuestions = async () => {
  const response = await axiosInstance
    .get('/progress/daily-test');
  return response.data;
};

export const getMCQQuestions = async () => {
  const response = await axiosInstance
    .get('/progress/mcq-questions');
  return response.data;
};