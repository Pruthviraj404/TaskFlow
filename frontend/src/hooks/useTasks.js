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

  const stats = useMemo(() => {
    const currentTasks = Array.isArray(tasks) ? tasks : [];
    const today = new Date().toISOString().split('T')[0];
    const completed = currentTasks.filter(t => t.is_done === 1).length;
    
    return {
      total: currentTasks.length,
      pending: currentTasks.filter(t => t.is_done === 0).length,
      completed,
      overdue: currentTasks.filter(t => t.due_date < today && t.is_done === 0).length,
      // Calculates progress ring percentage for Screen 04
      rate: currentTasks.length ? Math.round((completed / currentTasks.length) * 100) : 0
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const list = Array.isArray(tasks) ? [...tasks] : [];
    const today = new Date().toISOString().split('T')[0];
    
    // 1. First apply search query filtering
    let result = list;
    if (searchQuery) {
      result = result.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 2. Apply Sidebar Navigation Filters
    switch (filter) {
      case 'Today': 
        return result.filter(t => t.due_date === today);
      case 'Completed': 
        return result.filter(t => t.is_done === 1);
      case 'Overdue': 
        return result.filter(t => t.due_date < today && t.is_done === 0);
      
      // NEW: Quick Filter Implementation for Sidebar categories
      case 'work':
      case 'personal':
      case 'study':
        return result.filter(t => t.category?.toLowerCase() === filter.toLowerCase());
        
      default: 
        return result;
    }
  }, [tasks, filter, searchQuery]);

  return { tasks, filteredTasks, stats, handleToggle, handleDelete, handleAdd };
};