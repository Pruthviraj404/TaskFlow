import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete, onEdit, darkMode }) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
}