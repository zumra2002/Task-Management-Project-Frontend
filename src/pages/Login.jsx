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

  // Redirect to the Register Page
  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-picture">
      <div className="w-[400px] bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleOnSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-[40px] px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-[40px] px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full h-[45px] bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-5">
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
