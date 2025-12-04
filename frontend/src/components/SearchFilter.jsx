import { useState, useEffect } from 'react';
import { TaskPriority, TaskStatus, PriorityLabels, StatusLabels } from '../types/task';

const SearchFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    status: initialFilters.status || '',
    priority: initialFilters.priority || '',
    dueDate: initialFilters.dueDate || ''
  });

  useEffect(() => {
    // Debounce search input
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      status: '',
      priority: '',
      dueDate: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority || filters.dueDate;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 mb-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Filter & Search</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center space-x-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label htmlFor="search" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Search Tasks
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by title or description..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <svg
              className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-40">
          <label htmlFor="status" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full pl-3 pr-8 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
            >
              <option value="">All Statuses</option>
              {Object.entries(StatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <svg className="absolute right-2.5 top-3 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="w-full md:w-40">
          <label htmlFor="priority" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Priority
          </label>
          <div className="relative">
            <select
              id="priority"
              name="priority"
              value={filters.priority}
              onChange={handleChange}
              className="w-full pl-3 pr-8 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
            >
              <option value="">All Priorities</option>
              {Object.entries(PriorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <svg className="absolute right-2.5 top-3 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
