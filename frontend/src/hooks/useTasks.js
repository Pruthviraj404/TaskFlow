import { useState, useEffect, useMemo } from 'react';
import * as TaskService from '../services/TaskService';

export const useTasks = (filter, searchQuery, userId) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }
    const loadData = async () => {
      try {
        const data = await TaskService.getTasks();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
        setTasks([]);
      }
    };
    loadData();
  }, [userId]);

  const handleToggle = async (id) => {
    try {
      await TaskService.ToggleTaskStatus(id);
      setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, is_done: t.is_done === 1 ? 0 : 1 } : t
      ));
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await TaskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAdd = async (taskData) => {
    try {
      const savedTask = await TaskService.createTask(taskData);
      setTasks(prev => [savedTask, ...prev]);
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const updatedTask = await TaskService.updateTask(id, updatedData);
      setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, ...updatedTask } : t)
      );
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const stats = useMemo(() => {
    const currentTasks = Array.isArray(tasks) ? tasks : [];
    const today = new Date().toLocaleDateString('en-CA'); // ✅ local date
    const completed = currentTasks.filter(t => t.is_done === 1).length;

    return {
      total: currentTasks.length,
      pending: currentTasks.filter(t => t.is_done === 0).length,
      completed,
      overdue: currentTasks.filter(t => {
        if (!t.due_date || t.is_done === 1) return false;
        const due = t.due_date.split('T')[0];
        return due < today;
      }).length,
      rate: currentTasks.length ? Math.round((completed / currentTasks.length) * 100) : 0
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const list = Array.isArray(tasks) ? [...tasks] : [];
    const today = new Date().toLocaleDateString('en-CA'); // ✅ local date
    let result = list;

    if (searchQuery) {
      result = result.filter(t =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {

      case 'Today':
        return result.filter(t => {
          if (!t.due_date || t.is_done === 1) return false;
          const due = t.due_date.split('T')[0];
          return due === today;
        });

      case 'Pending':
        return result.filter(t => t.is_done === 0);

      case 'Completed':
        return result.filter(t => t.is_done === 1);

      case 'Overdue':
        return result.filter(t => {
          if (!t.due_date || t.is_done === 1) return false;
          const due = t.due_date.split('T')[0];
          return due < today;
        });

      case 'work':
      case 'personal':
      case 'study':
        return result.filter(t =>
          t.category?.toLowerCase() === filter.toLowerCase() && t.is_done === 0
        );

      default:
        return result;
    }
  }, [tasks, filter, searchQuery]);

  return { tasks, filteredTasks, stats, handleToggle, handleDelete, handleAdd, handleEdit };
};