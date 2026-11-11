import { useState } from 'react';
import { ConfirmModal } from './components/ConfirmModal';
import { EditTaskModal } from './components/EditTaskModal';
import { FilterBar } from './components/FilterBar';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import { useTasks } from './hooks/useTasks';
import { useToast } from './hooks/useToast';

export default function App() {
  const { toasts, showToast, dismissToast } = useToast();
  const {
    filteredTasks,
    counts,
    loading,
    error,
    submitting,
    pendingIds,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    fetchTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  } = useTasks(showToast);

  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [confirmClearCompleted, setConfirmClearCompleted] = useState(false);

  const handleResetFilters = () => {
    setFilter('all');
    setSearchQuery('');
  };

  return (
    <div
      id="top"
      className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#0A090F] text-white lg:h-screen lg:overflow-hidden"
    >
      {/* Subtle blinking full-site grid & ambient Android Club backdrop */}
      <div
        aria-hidden="true"
        className="club-grid-bg club-bg-blink pointer-events-none fixed inset-0"
      />
      <div
        aria-hidden="true"
        className="club-bg-blink pointer-events-none fixed -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="club-bg-blink pointer-events-none fixed -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#3DDC84]/15 blur-[120px]"
        style={{ animationDelay: '2s' }}
      />

      <Navbar />

      <main className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-4 sm:px-8 lg:min-h-0 lg:py-5">
        <div className="grid flex-1 grid-cols-1 gap-5 lg:min-h-0 lg:grid-cols-2 lg:gap-6">
          {/* Left Half: Header + Percentage Bar + Add Task Box */}
          <div className="flex min-w-0 flex-col justify-start gap-4 lg:min-h-0">
            <Header
              totalCount={counts.total}
              activeCount={counts.active}
              completedCount={counts.completed}
            />

            <TaskForm onAddTask={addTask} submitting={submitting} />
          </div>

          {/* Right Half: Filters + Created Task List Box */}
          <div className="flex min-w-0 flex-col rounded border border-[#262626] bg-[#171717]/40 p-3.5 sm:p-4 lg:min-h-0">
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              counts={counts}
              onClearCompletedRequest={() => setConfirmClearCompleted(true)}
              submitting={submitting}
            />

            <div className="mt-3 flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
              <TaskList
                tasks={filteredTasks}
                totalCount={counts.total}
                loading={loading}
                error={error}
                filter={filter}
                searchQuery={searchQuery}
                pendingIds={pendingIds}
                onRetry={fetchTasks}
                onResetFilters={handleResetFilters}
                onToggle={toggleTask}
                onEdit={(task) => setEditingTask(task)}
                onDeleteRequest={(task) => setTaskToDelete(task)}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
      />

      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete task?"
        message={
          taskToDelete
            ? `Are you sure you want to permanently delete "${taskToDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Task"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => deleteTask(taskToDelete._id)}
      />

      <ConfirmModal
        isOpen={confirmClearCompleted}
        title="Clear completed tasks?"
        message={`This will permanently remove all ${counts.completed} completed ${
          counts.completed === 1 ? 'task' : 'tasks'
        }. Active tasks will remain untouched.`}
        confirmLabel="Clear Completed"
        onCancel={() => setConfirmClearCompleted(false)}
        onConfirm={clearCompleted}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
