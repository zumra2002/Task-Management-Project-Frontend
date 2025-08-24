import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import { Link } from "react-router-dom";
import bgImage from "../assets/tk3.jpg"; // use tk3.jpg

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("due_date");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal state
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "Medium",
    isCompleted: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const itemsPerPage = 6;

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/tasks/mytasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err.response?.data || err.message);
      }
    };
    fetchTasks();
  }, []);

  // Apply search, filter, sort
  useEffect(() => {
    let data = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((t) => t.title?.toLowerCase().includes(q));
    }

    if (priorityFilter !== "All") {
      data = data.filter((t) => t.priority === priorityFilter);
    }

    if (statusFilter !== "All") {
      data = data.filter((t) =>
        statusFilter === "Completed" ? t.isCompleted : !t.isCompleted
      );
    }

    if (sortBy === "due_date") {
      data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    } else if (sortBy === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      data.sort((a, b) => (order[a.priority] || 99) - (order[b.priority] || 99));
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [tasks, search, priorityFilter, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTasks = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/tasks/deletetask/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  // Open edit modal
  const handleEdit = (task) => {
    setEditingTask(task);
    const due = task?.due_date ? String(task.due_date).slice(0, 10) : "";
    setEditForm({
      title: task.title || "",
      description: task.description || "",
      due_date: due, // yyyy-mm-dd for <input type="date">
      priority: task.priority || "Medium",
      isCompleted: Boolean(task.isCompleted),
    });
    setSaveError("");
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setSaving(false);
    setSaveError("");
  };

  // Update task (uses your original route: /api/tasks/update/:id)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTask?._id) return;

    setSaving(true);
    setSaveError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/tasks/update/${editingTask._id}`,
        {
          // send only expected fields
          title: editForm.title,
          description: editForm.description,
          due_date: editForm.due_date, // keep yyyy-mm-dd as your original code did
          priority: editForm.priority,
          isCompleted: editForm.isCompleted,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Prefer server response if provided, else merge locally
      const updatedTask = res.data?.task
        ? res.data.task
        : { ...editingTask, ...editForm };

      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? updatedTask : t))
      );

      closeEditModal();
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err.message);
      setSaveError(err.response?.data?.message || "Failed to update task.");
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen relative bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }} // tk3.jpg as background
    >
      <div className="relative p-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-6 bg-white/80 p-4 rounded-2xl shadow-md">
          <input
            type="text"
            placeholder="🔍 Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none w-64"
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-indigo-400"
          >
            <option value="due_date">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>

          <Link to="/AddTask" className="ml-auto">
            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition transform">
              + Add New Task
            </button>
          </Link>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition"
          >
            ⬅ Prev
          </button>
          <span className="px-4 py-1 bg-white/80 shadow rounded-xl text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition"
          >
            Next ➡
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>

            {saveError && (
              <div className="mb-3 text-sm text-red-600">{saveError}</div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
                placeholder="Title"
                required
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
                rows="3"
                placeholder="Description"
                required
              />

              <input
                type="date"
                value={editForm.due_date}
                onChange={(e) =>
                  setEditForm({ ...editForm, due_date: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
                required
              />

              <select
                value={editForm.priority}
                onChange={(e) =>
                  setEditForm({ ...editForm, priority: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.isCompleted}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isCompleted: e.target.checked })
                  }
                />
                Mark as Completed
              </label>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
