import api from './api';

class TaskService {
  // Get all tasks with optional filters
  async getTasks(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.dueDate) params.append('dueDate', filters.dueDate);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/tasks?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single task by ID
  async getTaskById(id) {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new task
  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update existing task
  async updateTask(id, taskData) {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete task
  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Parse voice transcript
  async parseVoiceTranscript(transcript) {
    try {
      const response = await api.post('/tasks/voice', { transcript });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors || [],
        status: error.response.status
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Unable to connect to server. Please check your connection.',
        errors: [],
        status: 0
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        errors: [],
        status: 0
      };
    }
  }
}

export default new TaskService();
