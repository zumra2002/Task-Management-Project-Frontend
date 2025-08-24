import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { firstname, lastname, email, password } = formData;

    if (!firstname || !lastname || !email || !password) {
      setError('All fields are required.');
      toast.error('All fields are required.');
      setLoading(false);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email.');
      toast.error('Please enter a valid email.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      toast.error('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users/register', formData);

      setSuccessMessage('Registration successful!');
      toast.success('Customer added successfully!');
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      });
      navigate('/');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Error registering user.');
        toast.error(err.response.data.message || 'Error registering user.');
      } else {
        setError('Error registering user. Please try again.');
        toast.error('Error registering user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-[420px] bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Create an Account ✨
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full h-[50px] px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full h-[50px] px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full h-[50px] px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full h-[50px] px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full h-[50px] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg shadow-md hover:opacity-90 active:scale-95 transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
