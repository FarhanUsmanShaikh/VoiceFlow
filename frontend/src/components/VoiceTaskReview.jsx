import { useState, useEffect } from 'react';
import { TaskPriority, TaskStatus, PriorityLabels, StatusLabels } from '../types/task';

const VoiceTaskReview = ({ transcript, parsedTask, onConfirm, onCancel, onReRecord }) => {
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

  const handleReRecord = () => {
    if (onReRecord) {
      onReRecord();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 max-w-4xl mx-auto transition-colors duration-300">
      {/* Header with Re-record Button */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-1">
              Review Voice Task
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Review and edit your voice-created task before saving
            </p>
          </div>
        </div>
        <button
          onClick={handleReRecord}
          className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
          title="Try voice input again"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <span>Try Again</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Raw Transcript */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Raw Transcript</h3>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">"{transcript}"</p>
          </div>
        </div>

        {/* Parsed Fields */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Extracted Information</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-2 bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-100 dark:border-green-900">
              <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[80px]">Title:</span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">{parsedTask?.title || 'Not detected'}</span>
            </div>
            <div className="flex items-start space-x-2 bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-100 dark:border-green-900">
              <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[80px]">Priority:</span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">{PriorityLabels[parsedTask?.priority] || 'Medium'}</span>
            </div>
            <div className="flex items-start space-x-2 bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-100 dark:border-green-900">
              <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[80px]">Status:</span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">{StatusLabels[parsedTask?.status] || 'To Do'}</span>
            </div>
            <div className="flex items-start space-x-2 bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-100 dark:border-green-900">
              <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[80px]">Due Date:</span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">{parsedTask?.dueDate || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Form */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Task Details</h3>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
            <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Task Title <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium text-base"
            placeholder="Enter task title"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
            <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h7" />
            </svg>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 resize-none"
            placeholder="Add detailed information about this task..."
          />
        </div>

        {/* Priority and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority */}
          <div className="space-y-2">
            <label htmlFor="priority" className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Priority Level
            </label>
            <select
              id="priority"
              name="priority"
              value={editedTask.priority}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium text-base cursor-pointer"
            >
              {Object.entries(PriorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Current Status
            </label>
            <select
              id="status"
              name="status"
              value={editedTask.status}
              onChange={handleChange}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium text-base cursor-pointer"
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
        <div className="space-y-2">
          <label htmlFor="dueDate" className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
            <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={editedTask.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
        <button
          onClick={onCancel}
          className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Cancel</span>
        </button>
        <button
          onClick={handleConfirm}
          className="px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>
    </div>
  );
};

export default VoiceTaskReview;
