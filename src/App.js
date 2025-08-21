import { Route,Router,Routes} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dumy from "./components/Dumy";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { LoginContext } from "./contex/LoginContext";
import { useState,useEffect } from "react";
import StudentDashboard from "./pages/StudentDashbord";
import AdminDashboard from "./pages/AdminDashbord";
import Register_complain from "./components/Register_complain";
import View_complain from "./pages/View_complain";
import AllComplain from "./pages/AllComplain";
import AllstudentDetail from "./pages/AllstudentDetail";
import Add_annoucement from "./components/Add_annoucement";
import Show_Notice from "./components/Show_Notice";
import VerifyOtp from "./pages/VerifyOtp";






function App() {
    const [userlogin, setuserlogin] = useState(false);
  const [adminlogin, setadminlogin] = useState(false);

  // ✅ Restore login from token on refresh
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      if (user.role === "admin") {
        setadminlogin(true);
      } else {
        setuserlogin(true);
      }
    } else {
      setuserlogin(false);
      setadminlogin(false);
    }
    
  }, []);

  return (
    <LoginContext.Provider value={{ setuserlogin, setadminlogin}}>
      <Navbar userlogin={userlogin} adminlogin={adminlogin} />

      <div className="pt-20 min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/register-complain" element={<Register_complain />} />
          <Route path="/view-complain" element={<View_complain />} />
          <Route path="/alldata_complain" element={<AllComplain/>} />
          <Route path="/allstudent_details" element={<AllstudentDetail/>} />
          <Route path="/addannoucement" element={<Add_annoucement/>} />
          <Route path="/allnotice" element={<Show_Notice/>} />
          <Route path="/verify-otp" element={<VerifyOtp/>} />
         </Routes>
      </div>

      <ToastContainer theme="dark" />
     
    </LoginContext.Provider>
  );
}

export default App;

