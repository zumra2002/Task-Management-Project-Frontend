import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import { Link } from "react-router-dom";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("due_date");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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
      data = data.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
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
      data.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [tasks, search, priorityFilter, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTasks = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/tasks/deletetask/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  // Edit
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const closeEditModal = () => {
    setEditingTask(null);
  };

  // Add Task
  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-6 bg-white p-4 rounded-2xl shadow-md">
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

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">✏️ Edit Task</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const token = localStorage.getItem("token");

                try {
                  const res = await axios.put(
                    `http://localhost:5000/api/tasks/update/${editingTask._id}`,
                    editingTask,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setTasks(
                    tasks.map((t) =>
                      t._id === editingTask._id ? res.data.task : t
                    )
                  );
                  closeEditModal();
                } catch (err) {
                  console.error("Error updating task:", err.response?.data || err.message);
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Title"
                required
              />

              <textarea
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                rows="3"
                placeholder="Description"
                required
              />

              <input
                type="date"
                value={editingTask.due_date?.split("T")[0]}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, due_date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />

              <select
                value={editingTask.priority}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, priority: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingTask.isCompleted}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      isCompleted: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Mark as Completed</span>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition"
                >
                  💾 Save
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-xl hover:bg-gray-300 transition"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 transition"
        >
          ⬅ Prev
        </button>
        <span className="px-4 py-1 bg-white shadow rounded-xl text-gray-700 font-medium">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
