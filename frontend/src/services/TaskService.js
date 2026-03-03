const API_URL = "http://localhost:5000/api/tasks";

// Fetch all tasks
export const getTasks = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

// Fetch filtered tasks
export const getTasksByStatus = async (status) => {
  const res = await fetch(`${API_URL}?status=${status}`);
  return res.json();
};

// Create a new task (Added for your Add Task Modal)
export const createTask = async (taskData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return res.json();
};

// Update task completion
export const toggleTaskStatus = async (id, is_done) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_done }),
  });
  return res.json();
};

// Delete a task
export const deleteTask = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};