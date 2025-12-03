import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const budgetService = {
  // Get all budgets with optional filtering
  getBudgets: async (params = {}) => {
    const response = await api.get('/budgets', { params });
    return response.data;
  },

  // Get single budget
  getBudget: async (id) => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  // Create new budget
  createBudget: async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  // Update budget
  updateBudget: async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  },

  // Delete budget
  deleteBudget: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },

  // Get budget summary with actual spending and optional filtering
  getBudgetSummary: async (params = {}) => {
    const response = await api.get('/budgets/summary', { params });
    return response.data;
  },

  // Get available periods for filtering
  getBudgetPeriods: async () => {
    const response = await api.get('/budgets/periods');
    return response.data;
  },

  // Get budgets for specific month
  getBudgetsForMonth: async (year, month) => {
    const response = await api.get('/budgets', {
      params: { year, month }
    });
    return response.data;
  },

  // Get budgets for specific year
  getBudgetsForYear: async (year) => {
    const response = await api.get('/budgets', {
      params: { year }
    });
    return response.data;
  },

  // Get budgets for specific period type
  getBudgetsForPeriod: async (period) => {
    const response = await api.get('/budgets', {
      params: { period }
    });
    return response.data;
  },
};

export default budgetService;