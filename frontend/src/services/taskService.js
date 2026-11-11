import api from './api';

export const taskService = {
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(payload) {
    const response = await api.post('/tasks', payload);
    return response.data;
  },

  async updateTask(id, payload) {
    const response = await api.put(`/tasks/${id}`, payload);
    return response.data;
  },

  async toggleTask(id) {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async clearCompletedTasks() {
    const response = await api.delete('/tasks/completed');
    return response.data;
  },
};

