// Task model - defines the structure and types for task entities

const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};

const isValidPriority = (priority) => {
  return Object.values(TaskPriority).includes(priority);
};

const isValidStatus = (status) => {
  return Object.values(TaskStatus).includes(status);
};

module.exports = {
  TaskPriority,
  TaskStatus,
  isValidPriority,
  isValidStatus
};
