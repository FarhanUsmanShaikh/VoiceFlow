import { useState, useEffect } from 'react';
import { TaskPriority, TaskStatus, PriorityLabels, StatusLabels } from '../types/task';

const VoiceTaskReview = ({ transcript, parsedTask, onConfirm, onCancel }) => {
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: ''
  });

  useEffect(() => {
    if (parsedTask) {
      setEditedTask({
        title: parsedTask.title || '',
        description: parsedTask.description || '',
        priority: parsedTask.priority || TaskPriority.MEDIUM,
        status: parsedTask.status || TaskStatus.TODO,
        dueDate: parsedTask.dueDate || ''
      });
    }
  }, [parsedTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirm = () => {
    onConfirm({
      ...editedTask,
      title: editedTask.title.trim() || 'Untitled Task',
      description: editedTask.description.trim() || null,
      dueDate: editedTask.dueDate || null
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Review Voice Task</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Raw Transcript */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Raw Transcript</h3>
          <p className="text-gray-600 dark:text-gray-400 italic">"{transcript}"</p>
        </div>

        {/* Parsed Fields */}
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Extracted Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Title:</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{parsedTask?.title || 'Not detected'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Priority:</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{PriorityLabels[parsedTask?.priority] || 'Medium'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Status:</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{StatusLabels[parsedTask?.status] || 'To Do'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Due Date:</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{parsedTask?.dueDate || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Form */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Edit Task Details</h3>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Enter task title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Add description (optional)"
          />
        </div>

        {/* Priority and Status Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={editedTask.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {Object.entries(PriorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={editedTask.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {Object.entries(StatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={editedTask.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default VoiceTaskReview;
