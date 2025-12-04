import { useState } from 'react';
import { PriorityLabels, PriorityColors, StatusLabels } from '../types/task';
import ConfirmationModal from './ConfirmationModal';

const TaskList = ({ tasks, onTaskClick, onTaskDelete }) => {
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteTaskTitle, setDeleteTaskTitle] = useState('');
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const [year, month, day] = dateString.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDelete = (e, task) => {
    e.stopPropagation();
    setDeleteTaskId(task.id);
    setDeleteTaskTitle(task.title);
  };

  const confirmDelete = async () => {
    await onTaskDelete(deleteTaskId);
    setDeleteTaskId(null);
    setDeleteTaskTitle('');
  };

  const isOverdue = (dateString, status) => {
    if (!dateString || status === 'done') return false;
  
    const [year, month, day] = dateString.split('T')[0].split('-');
    const dueDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No tasks found</h3>
        <p className="text-gray-500 dark:text-gray-400">Create a new task or adjust your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-slate-100 via-gray-100 to-slate-100 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {tasks.map(task => (
                <tr
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-700 cursor-pointer transition-all duration-150 border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {task.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {task.description || <span className="text-gray-400 dark:text-gray-500 italic">No description</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${PriorityColors[task.priority]}`}>
                      {PriorityLabels[task.priority]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {StatusLabels[task.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm flex items-center ${isOverdue(task.due_date, task.status) ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(task.due_date)}
                      {isOverdue(task.due_date, task.status) && ' (Overdue)'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={(e) => handleDelete(e, task)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg p-2 transition-all duration-150"
                      title="Delete task"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTaskId !== null}
        onClose={() => {
          setDeleteTaskId(null);
          setDeleteTaskTitle('');
        }}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTaskTitle}"? This action cannot be undone.`}
        confirmText="Delete Task"
        type="danger"
      />
    </>
  );
};

export default TaskList;
