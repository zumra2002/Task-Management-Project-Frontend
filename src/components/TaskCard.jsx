import React from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon,
} from "lucide-react";

function TaskCard({ task, onEdit, onDelete }) {
  const priorityColors = {
    High: "bg-red-100 text-red-600 border border-red-200",
    Medium: "bg-yellow-100 text-yellow-600 border border-yellow-200",
    Low: "bg-green-100 text-green-600 border border-green-200",
  };

  return (
    <div className="relative bg-white shadow-md rounded-2xl p-5 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      {/* Priority Badge */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${priorityColors[task.priority]}`}
      >
        {task.priority}
      </span>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 pr-16">{task.title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>

      {/* Due Date */}
      <div className="flex items-center text-sm text-gray-500 gap-2 mt-2">
        <ClockIcon size={16} />
        <span>{new Date(task.due_date).toLocaleDateString()}</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mt-1">
        {task.isCompleted ? (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-lg">
            <CheckCircleIcon size={16} /> Completed
          </span>
        ) : (
          <span className="flex items-center gap-1 text-orange-600 text-sm font-medium bg-orange-100 px-2 py-1 rounded-lg">
            <ClockIcon size={16} /> Pending
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition text-blue-600 font-medium text-sm shadow-sm"
        >
          <PencilIcon size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition text-red-600 font-medium text-sm shadow-sm"
        >
          <TrashIcon size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
