import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../contex/LoginContext";
// import "../css//"
const Navbar = ({ userlogin, adminlogin }) => {
  const navigate = useNavigate();
  const { setuserlogin, setadminlogin } = useContext(LoginContext);
  
const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.clear();
    setuserlogin(false);
    setadminlogin(false);
    navigate("/login");
  }
};


  const renderLinks = () => {
    if (userlogin) {
      return (
        <>
          <Link to="/student-dashboard" className="hover:underline">
            Dashboard
          </Link>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </>
      );
    } else if (adminlogin) {
      return (
        <>
          <Link to="/admin-dashboard" className="hover:underline">
            Admin Panel
          </Link>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Hostel Management
        </Link>
        <div className="space-x-4">{renderLinks()}</div>
      </div>
    </nav>
  );
};

export default Navbar;
