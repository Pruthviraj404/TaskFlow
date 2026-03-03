import { useEffect, useState } from "react";
import TaskList from "../components/tasks/TaskList";
import { getTasksByStatus } from "../services/TaskService";

export default function CompletedPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasksByStatus("completed").then(setTasks);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Completed Tasks</h2>
      <TaskList tasks={tasks} />
    </div>
  );
}