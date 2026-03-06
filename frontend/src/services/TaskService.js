const API_URL = "http://localhost:5000/api/tasks";

// GET all tasks
export const getTasks = async () => {

  const res = await fetch(API_URL, {
    credentials: "include"
  });

  return res.json();
};


// GET tasks by status
export const getTasksByStatus = async (status) => {

  const res = await fetch(`${API_URL}?status=${status}`, {
    credentials: "include"
  });

  return res.json();
};


// CREATE task
export const createTask = async (taskData) => {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(taskData)
  });

  return res.json();
};


// TOGGLE task status
export const ToggleTaskStatus = async (id, is_done) => {

  const res = await fetch(`${API_URL}/${id}/done`, {
    method: "PATCH",   // ⚠️ backend me PATCH hai
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ is_done })
  });

  return res.json();
};


// DELETE task
export const deleteTask = async (id) => {

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  return res.json();
};