import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const createApiClient = (token) => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return instance;
};

export const getWorkflowsAPI = (token) => {
  const api = createApiClient(token);
  return {
    getAll: () => api.get('/workflows'),
    getById: (id) => api.get(`/workflows/${id}`),
    create: (data) => api.post('/workflows', data),
    update: (id, data) => api.put(`/workflows/${id}`, data),
    delete: (id) => api.delete(`/workflows/${id}`),
    execute: (id, data) => api.post(`/workflows/${id}/execute`, data),
    getLogs: (id) => api.get(`/workflows/${id}/logs`),
  };
};

export const getAIAPI = (token) => {
  const api = createApiClient(token);
  return {
    validateWorkflow: (workflow) => api.post('/ai/validate-workflow', { workflow }),
    craftEmail: (emailContext, conditions) => api.post('/ai/craft-email', { emailContext, conditions }),
    getGuidance: (query, workflowContext) => api.post('/ai/guidance', { query, workflowContext }),
    extractEmailData: (emailContent) => api.post('/ai/extract-email-data', { emailContent }),
  };
};
