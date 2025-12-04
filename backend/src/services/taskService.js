const { pool } = require('../config/database');

class TaskService {
  // Find all tasks with optional filters
  async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM tasks WHERE 1=1';
      const params = [];

      // Apply status filter
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      // Apply priority filter
      if (filters.priority) {
        query += ' AND priority = ?';
        params.push(filters.priority);
      }

      // Apply due date filter
      if (filters.dueDate) {
        query += ' AND due_date = ?';
        params.push(filters.dueDate);
      }

      // Apply search filter (title or description)
      if (filters.search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      // Order by created_at descending
      query += ' ORDER BY created_at DESC';

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  }

  // Find task by ID
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tasks WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching task: ${error.message}`);
    }
  }

  // Create new task
  async create(taskData) {
    try {
      const { title, description, priority, status, dueDate } = taskData;
      
      const [result] = await pool.execute(
        'INSERT INTO tasks (title, description, priority, status, due_date) VALUES (?, ?, ?, ?, ?)',
        [title, description || null, priority || 'medium', status || 'todo', dueDate || null]
      );

      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  // Update existing task
  async update(id, taskData) {
    try {
      const { title, description, priority, status, dueDate } = taskData;
      
      const [result] = await pool.execute(
        'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ? WHERE id = ?',
        [title, description || null, priority, status, dueDate || null, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }
  }

  // Delete task
  async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM tasks WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }
}

module.exports = new TaskService();
