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
      rate: currentTasks.length ? Math.round((completed / currentTasks.length) * 100) : 0
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const list = Array.isArray(tasks) ? [...tasks] : [];
    const today = new Date().toISOString().split('T')[0];
    
    let result = list;
    if (searchQuery) {
      result = result.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    switch (filter) {
      case 'Today': 
        // FIX: Only show tasks due today that are NOT finished
        return result.filter(t => t.due_date === today && t.is_done === 0);
      
      case 'Pending':
        // NEW: Explicitly show only active tasks
        return result.filter(t => t.is_done === 0);

      case 'Completed': 
        return result.filter(t => t.is_done === 1);
        
      case 'Overdue': 
        return result.filter(t => t.due_date < today && t.is_done === 0);
      
      case 'work':
      case 'personal':
      case 'study':
        // FIX: Quick filters should only show active tasks in that category
        return result.filter(t => 
          t.category?.toLowerCase() === filter.toLowerCase() && t.is_done === 0
        );
        
      default: 
        // 'All' view usually shows everything, including completed
        return result;
    }
  }, [tasks, filter, searchQuery]);

  return { tasks, filteredTasks, stats, handleToggle, handleDelete, handleAdd };
};