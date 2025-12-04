const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validate, validateQuery, taskSchema, taskUpdateSchema, filterSchema } = require('../middleware/validation');

// GET /api/tasks - Get all tasks with optional filters
router.get('/', validateQuery(filterSchema), taskController.getAllTasks);

// GET /api/tasks/:id - Get single task by ID
router.get('/:id', taskController.getTaskById);

// POST /api/tasks - Create new task
router.post('/', validate(taskSchema), taskController.createTask);

// PUT /api/tasks/:id - Update existing task
router.put('/:id', validate(taskUpdateSchema), taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask);

// POST /api/tasks/voice - Parse voice transcript
router.post('/voice', taskController.createTaskFromVoice);

module.exports = router;
