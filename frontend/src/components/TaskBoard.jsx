import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { TaskStatus, StatusLabels } from '../types/task';
import DraggableTaskCard from './DraggableTaskCard';
import TaskCard from './TaskCard';
import ConfirmationModal from './ConfirmationModal';

// Droppable Column Component
const DroppableColumn = ({ column, children }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div ref={setNodeRef} className="flex-1">
      {children}
    </div>
  );
};

const TaskBoard = ({ tasks, onTaskMove, onTaskClick, onTaskDelete }) => {
  const [activeId, setActiveId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { 
      id: TaskStatus.TODO, 
      title: StatusLabels[TaskStatus.TODO], 
      color: 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900/40 dark:via-gray-900/40 dark:to-slate-800/40',
      headerColor: 'bg-gradient-to-r from-slate-600 to-gray-700 dark:from-slate-700 dark:to-gray-800',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      id: TaskStatus.IN_PROGRESS, 
      title: StatusLabels[TaskStatus.IN_PROGRESS], 
      color: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-blue-900/40',
      headerColor: 'bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: TaskStatus.DONE, 
      title: StatusLabels[TaskStatus.DONE], 
      color: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-green-900/40',
      headerColor: 'bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-900 dark:to-emerald-900',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    
    // Determine the target column
    let targetColumn = null;
    
    // Check if dropped directly on a column
    if (columns.some(col => col.id === over.id)) {
      targetColumn = over.id;
    } else {
      // Dropped on a task - find which column that task belongs to
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask) {
        targetColumn = overTask.status;
      }
    }

    // Update task status if it changed
    if (activeTask && targetColumn && activeTask.status !== targetColumn) {
      onTaskMove(activeTask.id, targetColumn);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await onTaskDelete(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`${column.headerColor} rounded-t-xl px-6 py-4 shadow-md`}>
                <h2 className="font-bold text-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {column.icon}
                    <span className="text-lg">{column.title}</span>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    {columnTasks.length}
                  </span>
                </h2>
              </div>

              {/* Column Content - Droppable Area */}
              <SortableContext
                id={column.id}
                items={columnTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn column={column}>
                  <div
                    className={`${column.color} dark:bg-gray-800/50 rounded-b-xl p-4 min-h-[500px] border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200 shadow-inner`}
                    data-column={column.id}
                  >
                    {columnTasks.length === 0 ? (
                      <div className="text-center text-gray-400 dark:text-gray-500 py-12">
                        <div className="mb-4 opacity-50 flex justify-center">
                          {column.icon}
                        </div>
                        <p className="font-medium">No tasks yet</p>
                        <p className="text-sm">Drag tasks here or create new ones</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {columnTasks.map(task => (
                          <DraggableTaskCard
                            key={task.id}
                            task={task}
                            onClick={onTaskClick}
                            onDelete={handleDeleteClick}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </DroppableColumn>
              </SortableContext>
            </div>
          );
        })}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onClick={() => {}}
            onDelete={() => {}}
            draggable={false}
          />
        ) : null}
      </DragOverlay>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={taskToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={taskToDelete ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.` : ''}
        confirmText="Delete Task"
        type="danger"
      />
    </DndContext>
  );
};

export default TaskBoard;
