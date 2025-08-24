// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserRegister from "./pages/UserRegister";
import Login from "./pages/Login";
import AddTask from "./pages/AddTask";
import TaskList from "./pages/TaskList";
import logo from "./assets/logo.png"; // logo in src/assets

// Header component
function Header() {
  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center p-4">
        {/* Logo */}
        <Link to="/list" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold">Task Manager</span>
        </Link>
      </div>
    </header>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-6 py-4 text-center text-sm">
        © {new Date().getFullYear()} Task Manager. All rights reserved.
      </div>
    </footer>
  );
}

// Main App
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/AddTask" element={<AddTask />} />
            <Route path="/list" element={<TaskList />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
