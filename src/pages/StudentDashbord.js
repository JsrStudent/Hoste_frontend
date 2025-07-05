import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import BASE_URL from "../api/config";


const StudentDashboard = () => {
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    regno: "",
    roomno: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("jwt");

    if (!user || !token) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    setStudent({
      name: user.name || "Student",
      regno: user.regno || "N/A",
      roomno: user.roomno || "N/A",
    });

    // Fetch complaint stats
    fetch(`${BASE_URL}/route/student_status`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        } else {
          toast.error("Failed to load complaint stats");
        }
      })
      .catch((err) => {
        console.error("Error fetching complaint stats:", err);
        toast.error("Error in status no.");
      });

    // Fetch announcements
    fetch(`${BASE_URL}/route/get/annoucment`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const sorted = data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAnnouncements(sorted.slice(0, 3)); // Show only latest 3 announcements
        } else {
          toast.error("Failed to load announcements");
        }
      })
      .catch((err) => {
        console.error("Error fetching announcements:", err);
        toast.error("Something went wrong");
      });
  }, [navigate]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl mb-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {student.name}!</h1>
            <p className="text-indigo-100 mb-4">Here's what's happening in your hostel today</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center">
                <span className="text-sm font-medium">🎓 Reg No:</span>
                <span className="ml-2 font-bold">{student.regno}</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center">
                <span className="text-sm font-medium">🚪 Room No:</span>
                <span className="ml-2 font-bold">{student.roomno}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div 
            variants={item}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-blue-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Complaints</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={item}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-yellow-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={item}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-green-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-4 mb-10"
        >
          <motion.button
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center"
            onClick={() => navigate("/register-complain")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Submit New Complaint
          </motion.button>
          
          <motion.button
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center"
            onClick={() => navigate("/view-complain")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View My Complaints
          </motion.button>
          
          <motion.button
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center"
            onClick={() => toast.info("Hostel scheme is coming soon!")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            View Hostel Scheme
          </motion.button>
        </motion.div>

        {/* Profile and Announcements */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <motion.div 
            variants={item}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Student Profile</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-500 w-32">Name:</span>
                <span className="font-medium">{student.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-32">Registration No:</span>
                <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{student.regno}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-32">Room No:</span>
                <span className="font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">{student.roomno}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={item}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Latest Announcements</h3>
            </div>
            
            <ul className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-sm text-gray-500">No announcements yet.</p>
              ) : (
                announcements.map((item) => (
                  <li key={item._id} className="flex items-start">
                    <div className="flex-shrink-0 h-2 w-2 mt-2 bg-indigo-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium capitalize">{item.description}</p>
                      <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
            
            <button
              onClick={() => navigate("/allnotice")}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              View all announcements
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;