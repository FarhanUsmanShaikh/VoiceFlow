import { PriorityLabels, PriorityColors } from '../types/task';

const TaskCard = ({ task, onClick, onDelete, draggable = true }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const [year, month, day] = dateString.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(task);
  };

  const handleCardClick = (e) => {
    onClick(task);
  };

  const isOverdue = task.due_date && (() => {
  
    const [year, month, day] = task.due_date.split('T')[0].split('-');
    const dueDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'done';
  })();

  const priorityStyles = {
    low: 'bg-gray-100 text-gray-700 border-gray-200',
    medium: 'bg-blue-100 text-blue-700 border-blue-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-0.5 transition-all duration-200 ${
        draggable ? 'cursor-move' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header with Priority and Delete */}
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityStyles[task.priority]}`}>
          {PriorityLabels[task.priority]}
        </span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg p-1.5 transition-all duration-200"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 text-base leading-snug">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer with Due Date */}
      {task.due_date && (
        <div className={`flex items-center text-xs font-medium mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {formatDate(task.due_date)}
            {isOverdue && ' • Overdue'}
          </span>
        </div>
      )}

    </div>
  );
};

export default TaskCard;
