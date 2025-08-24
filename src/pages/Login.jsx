import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleOnSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:5000/api/users/login', {
        email: email,
        password: password,
      })
      .then((res) => {
        toast.success('Login successful');
        const token = res.data.token;
        const decoded = jwtDecode(token);
        localStorage.setItem('token', token);
        navigate('/list');
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  // Redirect to the Register Page when user clicks "Sign Up"
  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="w-full h-screen flex items-center justify-center bg-picture">
        <div className="w-[400px] h-[350px] flex items-center justify-center flex-col relative backdrop-blur-2xl rounded-2xl p-6">
          
          <input
            type="email"
            placeholder="Email"
            className="w-[300px] h-[40px] pl-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-[300px] h-[40px] pl-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-[120px] h-[40px] bg-red-500 mt-4 rounded-2xl cursor-pointer text-white font-medium hover:bg-red-600"
          >
            Sign In
          </button>

          {/* Sign Up Button */}
          <button
            type="button"
            onClick={handleSignUp}
            className="w-[120px] h-[40px] bg-blue-500 mt-3 rounded-2xl cursor-pointer text-white font-medium hover:bg-blue-600"
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
}

export default Login;
