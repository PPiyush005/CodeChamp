import axiosInstance from './axiosInstance';

export const getAllTracks = async () => {
  const response = await axiosInstance
    .get('/roadmap/tracks');
  return response.data;
};

export const getTrackSteps = async (trackId) => {
  const response = await axiosInstance
    .get(`/roadmap/tracks/${trackId}/steps`);
  return response.data;
};

export const getTrackProgress = async (trackId) => {
  const response = await axiosInstance
    .get(`/roadmap/tracks/${trackId}/progress`);
  return response.data;
};

export const getAllTracksProgress = async () => {
  const response = await axiosInstance
    .get('/roadmap/my-progress');
  return response.data;
};

export const toggleStepComplete = async (stepId) => {
  const response = await axiosInstance
    .put(`/roadmap/steps/${stepId}/complete`);
  return response.data;
};