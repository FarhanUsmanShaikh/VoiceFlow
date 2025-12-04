const taskService = require('../services/taskService');

class TaskController {
  // Get all tasks with optional filters
  async getAllTasks(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        dueDate: req.query.dueDate,
        search: req.query.search
      };

      const tasks = await taskService.findAll(filters);

      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single task by ID
  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.findById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`
        });
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new task
  async createTask(req, res, next) {
    try {
      const taskData = {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate
      };

      const task = await taskService.create(taskData);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  // Update existing task
  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const taskData = {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate
      };

      const task = await taskService.update(id, taskData);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete task
  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await taskService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Task with ID ${id} not found`
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Create task from voice transcript
  async createTaskFromVoice(req, res, next) {
    try {
      const { transcript } = req.body;

      if (!transcript || typeof transcript !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Transcript is required'
        });
      }

      // Parse the transcript using NLP parser
      const nlpParser = require('../utils/nlpParser');
      const parsedTask = nlpParser.parseTranscript(transcript);

      res.status(200).json({
        success: true,
        message: 'Transcript parsed successfully',
        data: {
          transcript,
          parsed: parsedTask
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
