import { useEffect, useState } from "react";
import TaskList from "../components/tasks/TaskList";
import {
  getTasks,
  toggleTaskStatus,
  deleteTask,
} from "../services/TaskService";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggle = async (task: { id: number; is_done: boolean }) => {
    await toggleTaskStatus(task.id, task.is_done ? 0 : 1);
    loadTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    loadTasks();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Tasks</h2>
      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}