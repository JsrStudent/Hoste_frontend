import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('jwt');

    if (token && user) {
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  }, [navigate]);

  return (
    <div>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">
          Welcome to Hostel Management System - This is Home Page
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Submit and track your hostel complaints easily
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;