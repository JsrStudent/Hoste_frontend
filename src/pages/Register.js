import React, { useState } from 'react'
import {Link,useNavigate} from "react-router-dom"
import BASE_URL from '../api/config';

const Register = () => {

    const n=useNavigate();

    const [name,setname]=useState("");
    const[regno,setregno]=useState("");
    const[email,setemail]=useState("");
    const[phoneno,setphoneno]=useState("");
    const[password,setpassword]=useState("")
    const[role,setrole]=useState("");
    const [roomno, setroomno] = useState('');

    const validation = (data) => {
        console.log("you are in validation data")
        console.log(data)
        const { email, phoneno, password } = data;
      
        // Validate email (basic regex pattern for simplicity)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          alert("Invalid email format.");
          return false;
        }
      
        // Validate phone number (10 digits only)
        if (!/^\d{10}$/.test(phoneno)) {
          alert("Phone number must be 10 digits.");
          return false;
        }
      
        // Validate password length (minimum 5 characters)
        if (password.length < 5) {
          alert("Password must be at least 5 characters long.");
          return false;
        }
      
        return true; // All validations passed
      };
      

  const signup_fun=async(e)=>{
    e.preventDefault(); // Prevent page refresh

    //  validation of data 
    const data = {
        name,
        regno,
        phoneno,
        email,
        password,
        role,
        roomno,
      };

    if(validation(data)){
        console.log({
            name: name,
            regno: regno,
            phoneno: phoneno,
            email: email,
            password: password,
            role: role
          });

        alert("validation done ")

        // 🔹 Updated fetch call (send OTP request instead of direct signup)
        fetch(`${BASE_URL}/route/signup-request`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name: name,
                regno: regno,
                phoneno: phoneno,
                email: email,
                password: password,
                role: role,
                roomno:roomno
            })
        })
        .then(res=>res.json())
        .then((d) => {
            if (d.success) {
              alert("✅ OTP sent to your email. Please verify.");
              localStorage.setItem("pendingEmail", email); // ✅ store email for OTP page
              n("/verify-otp"); // ✅ redirect to OTP page
            } else {
              alert(d.message);
            }
        })
        .catch(err => {
          console.error("Signup error:", err);
          alert("Something went wrong. Try again.");
        });
      }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
    <form>
      {/* Name */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setname(e.target.value)}
        />
      </div>

      {/* Registration Number */}
      <div className="mb-4">
        <label htmlFor="regno" className="block text-sm font-medium text-gray-700">
          Registration Number
        </label>
        <input
          type="text"
          id="regno"
          placeholder="Enter your registration number"
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setregno(e.target.value)}
        />
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneno"
          placeholder="Enter your phone number"
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setphoneno(e.target.value)}
        />
      </div>

      {/* 🆕 Room Number */}
      <div className="mb-4">
        <label htmlFor="roomno" className="block text-sm font-medium text-gray-700">
          Room Number
        </label>
        <input
          type="text"
          id="roomno"
          placeholder="Enter your room number"
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setroomno(e.target.value)}
        />
      </div>

      {/* Role */}
      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setrole(e.target.value)} 
        >
          <option value="">Select a role</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>

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
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="text"
          id="password"
          placeholder="Enter your password"
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setpassword(e.target.value)} 
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={signup_fun}
        >
          Sign Up
        </button>
      </div>

      <div className='text-center mt-2'>
        <p>
          Already have an account?{" "}
          <Link to="/login">
            <span className='text-blue-500'>Login</span>
          </Link>
        </p>
      </div>
    </form>
  </div>
</div>
  )
}

export default Register
