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
  const [editingTask, setEditingTask] = useState(null);

  const itemsPerPage = 6;

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found, please log in.");

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
  const handleEdit = (task) => setEditingTask(task);
  const closeEditModal = () => setEditingTask(null);

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
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 transition"
          >
            ⬅ Prev
          </button>
          <span className="px-4 py-1 bg-white/80 shadow rounded-xl text-gray-700 font-medium">
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
    </div>
  );
}
