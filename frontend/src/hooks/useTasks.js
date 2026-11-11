import { useCallback, useEffect, useMemo, useState } from 'react';
import { taskService } from '../services/taskService';

export function useTasks(showToast) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const markPending = (id, isPending) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (isPending) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(
    async (payload) => {
      setSubmitting(true);
      try {
        const created = await taskService.createTask(payload);
        setTasks((prev) => [created, ...prev]);
        showToast?.('Task added successfully', 'success');
        return created;
      } catch (err) {
        showToast?.(err.message, 'error');
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [showToast]
  );

  const updateTask = useCallback(
    async (id, payload) => {
      markPending(id, true);
      try {
        const updated = await taskService.updateTask(id, payload);
        setTasks((prev) => prev.map((task) => (task._id === id ? updated : task)));
        showToast?.('Task updated', 'success');
        return updated;
      } catch (err) {
        showToast?.(err.message, 'error');
        throw err;
      } finally {
        markPending(id, false);
      }
    },
    [showToast]
  );

  const toggleTask = useCallback(
    async (id) => {
      markPending(id, true);
      try {
        const updated = await taskService.toggleTask(id);
        setTasks((prev) => prev.map((task) => (task._id === id ? updated : task)));
        showToast?.(
          updated.completed ? 'Task marked complete' : 'Task marked active',
          updated.completed ? 'success' : 'info'
        );
        return updated;
      } catch (err) {
        showToast?.(err.message, 'error');
        throw err;
      } finally {
        markPending(id, false);
      }
    },
    [showToast]
  );

  const deleteTask = useCallback(
    async (id) => {
      markPending(id, true);
      try {
        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((task) => task._id !== id));
        showToast?.('Task deleted', 'info');
      } catch (err) {
        showToast?.(err.message, 'error');
        throw err;
      } finally {
        markPending(id, false);
      }
    },
    [showToast]
  );

  const clearCompleted = useCallback(async () => {
    setSubmitting(true);
    try {
      const result = await taskService.clearCompletedTasks();
      setTasks((prev) => prev.filter((task) => !task.completed));
      const count = result?.deletedCount ?? 0;
      showToast?.(
        count > 0
          ? `Cleared ${count} completed ${count === 1 ? 'task' : 'tasks'}`
          : 'No completed tasks to clear',
        'info'
      );
    } catch (err) {
      showToast?.(err.message, 'error');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [showToast]);

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    return {
      total,
      active: total - completed,
      completed,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      if (filter === 'active' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;
      if (query) {
        const titleMatch = task.title?.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        return Boolean(titleMatch || descMatch);
      }
      return true;
    });
  }, [tasks, filter, searchQuery]);

  return {
    tasks,
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
  };
}

