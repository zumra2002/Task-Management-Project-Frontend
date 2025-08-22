import React from "react";
import { CheckCircleIcon, ClockIcon, TrashIcon, PencilIcon } from "lucide-react";


function TaskCard({ task, onEdit, onDelete }) {
  const priorityColors = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm">{task.description}</p>

      {/* Due Date */}
      <div className="flex items-center text-sm text-gray-500 gap-2">
        <ClockIcon size={16} />
        <span>{new Date(task.due_date).toLocaleDateString()}</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mt-2">
        {task.isCompleted ? (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircleIcon size={16} /> Completed
          </span>
        ) : (
          <span className="flex items-center gap-1 text-orange-500 text-sm font-medium">
            <ClockIcon size={16} /> Pending
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
        >
          <PencilIcon size={18} className="text-blue-600" />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition"
        >
          <TrashIcon size={18} className="text-red-600" />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
