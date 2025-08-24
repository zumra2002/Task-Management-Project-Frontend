# Task-Management-Project-Frontend
📝 Task Manager Web Application

A full-stack Task Manager web application built using the MERN Stack (MongoDB, Express, React, Node.js).
The app allows users to manage their tasks with features like add, edit, delete, mark as completed, search, filter, pagination, sorting, and authentication (JWT).

📌 Frontend README (React + Vite)
# Task Manager Frontend

This is the **frontend** of the Task Manager WebApp built with **React (Vite)** and **TailwindCSS**.  
It allows users to log in, register, add tasks, view tasks, and manage them.

---

## 🚀 Tech Stack
- React (Vite)
- React Router DOM
- Axios
- TailwindCSS

---

## 📂 Project Structure


frontend/
┣ src/
┃ ┣ assets/ # Images and logos
┃ ┣ components/ # Reusable components
┃ ┣ pages/ # Page components (Login, Register, TaskList, AddTask)
┃ ┣ App.jsx # Main app entry
┃ ┣ main.jsx # React DOM entry
┣ index.html
┣ package.json
┣ tailwind.config.js
┣ vite.config.js


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager/frontend

2️⃣ Install dependencies
npm install

3️⃣ Create .env file
VITE_API_BASE_URL=http://localhost:5000/api

4️⃣ Run the app
npm run dev

🌐 Deployment
Deploy on Netlify or Vercel

Netlify:

Push your repo to GitHub.

Connect repo on Netlify.

Build command: npm run build

Publish directory: dist

Vercel:

Import repo in Vercel.

Framework: Vite

Build command: npm run build

Output directory: dist

📝 Features

User login & register

Add, update, delete tasks

Task list with filters

Responsive UI with TailwindCSS
