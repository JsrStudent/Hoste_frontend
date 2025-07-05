import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const n = useNavigate();

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [role, setrole] = useState('');

  // Form validation
  const validate = (data) => {
    const { email, password, role } = data;
    if (!email || !password || !role) {
      alert("Please fill all the fields");
      return false;
    }
    return true;
  };

  // Login function
  const login_fun = async (e) => {
    e.preventDefault();

    const data = { email, password, role };

    if (!validate(data)) return;

    try {
      const res = await fetch("http://localhost:4000/route/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const d = await res.json();
      console.log("Server response:", d);

      if (d.success) {
        alert(d.message);

        localStorage.setItem("jwt", d.token);
        localStorage.setItem("user", JSON.stringify(d.user));

        // Navigate based on role
        if (d.user.role === "student") {
          n("/student-dashboard");
        } else if (d.user.role === "admin") {
          n("/admin-dashboard");
        } else {
          alert("Unknown role. Cannot redirect.");
        }
      } else {
        alert(d.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setemail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setrole(e.target.value)}
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={login_fun}
            >
              Login
            </button>
          </div>

          {/* Link to Register */}
          <div className="text-center mt-4 text-sm">
            <p>Don’t have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
