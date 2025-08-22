import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // This hook will help in navigating between pages

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
        navigate('/list')
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  // Redirect to the Register Page when user clicks "Sign Up"
  const handleSignUp = () => {
    navigate('/register'); // Navigates to the Register page
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="w-full h-screen flex items-center justify-center bg-picture">
        <div className="w-[400px] h-[400px] flex items-center justify-center flex-col relative backdrop-blur-2xl rounded-2xl">
          <img
            src="/logo.png"
            alt="logo"
            className="w-[100px] h-[100px] rounded-full border-[1px] absolute top-6"
          />

          <input
            type="Email"
            placeholder="Email"
            className="w-[300px] h-[35px] pl-2 mt-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="Password"
            placeholder="Password"
            className="w-[300px] h-[35px] pl-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Sign In Button */}
          <button className="w-[100px] h-[35px] bg-red-500 mt-6 rounded-2xl cursor-pointer">
            Sign In
          </button>

          {/* Sign Up Button */}
          <button
            type="button"
            onClick={handleSignUp} // Calls the handleSignUp function
            className="w-[100px] h-[35px] bg-blue-500 mt-4 rounded-2xl cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
}

export default Login;
