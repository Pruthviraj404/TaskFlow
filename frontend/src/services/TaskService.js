
const API_URL = "http://localhost:5000/api/tasks";

export const getTasks= async()=>{

  const res= await fetch(API_URL);
  return res.json();
};

export const getTasksByStatus = async (status)=>{

  const res = await fetch(`${API_URL}?status=${status}`);
  return res.json();

}

export const createTask = async(taskData)=>{

  const res = await fetch(API_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(taskData),

  });

  return res.json();
};

export const ToggleTaskStatus = async (id,is_done)=>{
  const res= await fetch(`${API_URL}/${id}/done`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({is_done}),
  });
  return res.json();
};

export const deleteTask= async(id)=>{
  await fetch(`${API_URL}/${id}`,{
    method:"DELETE",
  });
};
