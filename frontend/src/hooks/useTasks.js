import { useState, useEffect, useMemo } from 'react';
import * as TaskService from '../services/TaskService';

export const useTasks = (filter, searchQuery) => {
  const [tasks, setTasks] = useState([]);

  

  // Fetch from your Express backend on load
 
  useEffect(()=>{
    const loadData = async ()=>{
      try{
        const data = await TaskService.getTasks();
        setTasks(data);
      }catch(error){
        console.log("Failed to load tasks",error);
      }
    }
    loadData();
  },[])
  const handleToggle = async (id) => {
    try {
      await TaskService.toggleTaskStatus(id);
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

  // Stats calculation
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const completed = tasks.filter(t => t.is_done === 1).length;
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.is_done === 0).length,
      completed,
      overdue: tasks.filter(t => t.due_date < today && t.is_done === 0).length,
      rate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0
    };
  }, [tasks]);

  // Filtering logic
  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    if (searchQuery) list = list.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const today = new Date().toISOString().split('T')[0];
    switch (filter) {
      case 'Today': return list.filter(t => t.due_date === today);
      case 'Completed': return list.filter(t => t.is_done === 1);
      case 'Overdue': return list.filter(t => t.due_date < today && t.is_done === 0);
      default: return list;
    }
  }, [tasks, filter, searchQuery]);

  return { tasks, filteredTasks, stats, handleToggle, handleDelete, handleAdd };
};