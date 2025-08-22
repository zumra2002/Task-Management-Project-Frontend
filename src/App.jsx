import { useState } from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'

import UserRegister from './pages/UserRegister'
import Login from './pages/Login'
import AddTask from './pages/AddTask'

import TaskList from './pages/TaskList'

function App() {
  const [count, setCount] = useState(0)

  return (
   <BrowserRouter>
       <Routes>
           
           <Route path="/register" element={<UserRegister />} />
           <Route path="/" element={<Login />} />
           <Route path="/AddTask" element={<AddTask />} />
           <Route path="/list" element={<TaskList />} />

       </Routes>
   </BrowserRouter>
  )
}

export default App
