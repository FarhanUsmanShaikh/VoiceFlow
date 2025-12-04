import { useState, useEffect } from 'react';
import { TaskPriority, TaskStatus, PriorityLabels, StatusLabels } from '../types/task';

const TaskForm = ({ task, onSubmit, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate form when editing
  useEffect(() => {
    if (task && mode === 'edit') {
      // Format date to YYYY-MM-DD for date input
      let formattedDate = '';
      if (task.due_date) {
        const date = new Date(task.due_date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }
      }
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || TaskPriority.MEDIUM,
        status: task.status || TaskStatus.TODO,
        dueDate: formattedDate
      });
    }
  }, [task, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must not exceed 255 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || null
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { 
      value: TaskPriority.LOW, 
      label: PriorityLabels[TaskPriority.LOW],
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: '○'
    },
    { 
      value: TaskPriority.MEDIUM, 
      label: PriorityLabels[TaskPriority.MEDIUM],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: '◐'
    },
    { 
      value: TaskPriority.HIGH, 
      label: PriorityLabels[TaskPriority.HIGH],
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: '●'
    },
    { 
      value: TaskPriority.URGENT, 
      label: PriorityLabels[TaskPriority.URGENT],
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '⚠'
    }
  ];

  const statusOptions = [
    { 
      value: TaskStatus.TODO, 
      label: StatusLabels[TaskStatus.TODO],
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: '📋'
    },
    { 
      value: TaskStatus.IN_PROGRESS, 
      label: StatusLabels[TaskStatus.IN_PROGRESS],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: '⚡'
    },
    { 
      value: TaskStatus.DONE, 
      label: StatusLabels[TaskStatus.DONE],
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: '✓'
    }
  ];

  const selectedPriority = priorityOptions.find(p => p.value === formData.priority);
  const selectedStatus = statusOptions.find(s => s.value === formData.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 max-w-3xl mx-auto transition-colors duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className={`${mode === 'create' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} rounded-2xl p-4 shadow-lg`}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mode === 'create' ? "M12 6v6m0 0v6m0-6h6m-6 0H6" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {mode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {mode === 'create' ? 'Add a new task to your workflow' : 'Update task details and track progress'}
            </p>
          </div>
        </div>
        {mode === 'edit' && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Editing</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="title" className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Task Title <span className="text-red-500 dark:text-red-400 ml-1">*</span>
            </label>
            <span className={`text-xs font-medium ${formData.title.length > 200 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {formData.title.length}/255
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base font-medium ${
                errors.title 
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200' 
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100'
              }`}
              placeholder="e.g., Complete project proposal, Review design mockups..."
              maxLength={255}
            />
            {formData.title && !errors.title && (
              <div className="absolute right-3 top-4">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {errors.title && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700 font-medium">{errors.title}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h7" />
              </svg>
              Description
            </label>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
              {formData.description.length} characters
            </span>
          </div>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 resize-none text-gray-900 dark:text-gray-100"
              placeholder="Add detailed information about this task, including requirements, notes, or any relevant context..."
            />
            {!formData.description && (
              <div className="absolute bottom-4 right-4 text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Priority and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Priority Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'priority', value: option.value } })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.priority === option.value
                      ? `${option.bgColor} dark:bg-opacity-20 border-current ${option.color} shadow-md scale-105`
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl">{option.icon}</span>
                    <span className="text-sm font-semibold">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
            {selectedPriority && (
              <div className={`flex items-center space-x-2 p-2 rounded-lg ${selectedPriority.bgColor}`}>
                <span className="text-lg">{selectedPriority.icon}</span>
                <span className={`text-xs font-medium ${selectedPriority.color}`}>
                  {selectedPriority.label} priority selected
                </span>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Current Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'status', value: option.value } })}
                  className={`w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                    formData.status === option.value
                      ? `${option.bgColor} dark:bg-opacity-20 border-current ${option.color} shadow-md`
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm'
                  }`}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="text-sm font-semibold flex-1 text-left">{option.label}</span>
                  {formData.status === option.value && (
                    <svg className={`w-5 h-5 ${option.color}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-3">
          <label htmlFor="dueDate" className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
            <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium"
            />
            {formData.dueDate && (
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'dueDate', value: '' } })}
                className="absolute right-3 top-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Clear due date"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {formData.dueDate && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-blue-700 font-medium">
                Due {new Date(formData.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Summary Card */}
        {formData.title && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-100 dark:border-indigo-800 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Task Summary</h3>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">{formData.title}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedPriority?.bgColor} ${selectedPriority?.color}`}>
                    {selectedPriority?.icon} {selectedPriority?.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedStatus?.bgColor} ${selectedStatus?.color}`}>
                    {selectedStatus?.icon} {selectedStatus?.label}
                  </span>
                  {formData.dueDate && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      📅 {new Date(formData.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center space-x-2"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mode === 'create' ? "M12 6v6m0 0v6m0-6h6m-6 0H6" : "M5 13l4 4L19 7"} />
                </svg>
                <span>{mode === 'create' ? 'Create Task' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
