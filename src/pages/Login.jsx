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
        jwtDecode(token); // decoded if needed
        localStorage.setItem('token', token);
        navigate('/list');
      })
      .catch((err) => {
        toast.error(err.response?.data || 'Login failed');
      });
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-[420px] bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleOnSubmit} className="flex flex-col space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-[50px] px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full h-[50px] px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full h-[50px] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg shadow-md hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Don’t have an account?{' '}
          <span
            onClick={handleSignUp}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
