const BASE_URL = "http://localhost:5000/api";
const TASKS_URL = `${BASE_URL}/tasks`;
const AUTH_URL = `${BASE_URL}/auth`;


export const changePassword = async (passwordData) => {
  const res = await fetch(`${AUTH_URL}/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(passwordData)
  });

  const contentType = res.headers.get("content-type");
  
  if (!res.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || errorData.message || "Failed to update");
    }
   
    throw new Error("route not found");
  }

  return res.json();
};

export const updateTask = async (id, taskData) => {
  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(taskData),
  });
  return res.json();
};

export const getTasks = async () => {
  const res = await fetch(TASKS_URL, {
    credentials: "include"
  });
  return res.json();
};


export const getTasksByStatus = async (status) => {
  const res = await fetch(`${TASKS_URL}?status=${status}`, {
    credentials: "include"
  });
  return res.json();
};


export const createTask = async (taskData) => {
  const res = await fetch(TASKS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(taskData)
  });
  return res.json();
};

export const ToggleTaskStatus = async (id, is_done) => {
  const res = await fetch(`${TASKS_URL}/${id}/done`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ is_done })
  });
  return res.json();
};


export const deleteTask = async (id) => {
  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  return res.json();
};