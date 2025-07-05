import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import BASE_URL from "../api/config";


const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    totalStudents: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalRooms: 700,
    occupiedRooms: 0,
    availableRooms: 700
  });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("jwt");

    if (!user || !token || user.role !== 'admin') {
      toast.warning("Unauthorized access. Please login as admin.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student count
        const studentRes = await fetch(`${BASE_URL}/route/admin/total_student`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const studentData = await studentRes.json();

        // Fetch complaint stats
        const complaintRes = await fetch(`${BASE_URL}/route/admin/total_status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const complaintData = await complaintRes.json();

        // Fetch announcements
        const announcementRes = await fetch(`${BASE_URL}/route/get/annoucment`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const announcementData = await announcementRes.json();

        if (studentData.success && complaintData.success && announcementData.success) {
          const occupied = studentData.data.totalStudents || 0;
          setStats({
            totalStudents: occupied,
            totalComplaints: complaintData.data.total || 0,
            pendingComplaints: complaintData.data.pending || 0,
            resolvedComplaints: complaintData.data.resolved || 0,
            totalRooms: 700,
            occupiedRooms: occupied,
            availableRooms: 700 - occupied
          });
          setAnnouncements(announcementData.data);
        } else {
          toast.error("Failed to load some dashboard data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    whileHover: { scale: 1.05, x: 5 },
  };

  const getAnnouncementIcon = (type) => {
    switch(type) {
      case 'internet': return '🌐';
      case 'electricity': return '💡';
      case 'room': return '🚪';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100">Manage hostel operations efficiently</p>
            </div>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Admin</span>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {/* Total Students */}
          <motion.div
            variants={item}
            whileHover={item.whileHover}
            onClick={() => navigate("/allstudent_details")}
            className="cursor-pointer bg-gradient-to-br from-blue-100 to-blue-300 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-900">Total Students</p>
                <p className="text-3xl font-bold text-blue-800">{stats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-200 text-blue-700 text-xl">👥</div>
            </div>
          </motion.div>

          {/* Total Complaints */}
          <motion.div
            variants={item}
            whileHover={item.whileHover}
            onClick={() => navigate("/alldata_complain")}
            className="cursor-pointer bg-gradient-to-br from-purple-100 to-purple-300 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-900">Total Complaints</p>
                <p className="text-3xl font-bold text-purple-800">{stats.totalComplaints}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-200 text-purple-700 text-xl">📄</div>
            </div>
          </motion.div>

          {/* Pending Complaints */}
          <motion.div
            variants={item}
            whileHover={item.whileHover}
            
            className="cursor-pointer bg-gradient-to-br from-yellow-100 to-yellow-300 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-yellow-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-900">Pending Complaints</p>
                <p className="text-3xl font-bold text-yellow-800">{stats.pendingComplaints}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-200 text-yellow-700 text-xl">⏳</div>
            </div>
          </motion.div>

          {/* Resolved Complaints */}
          <motion.div
            variants={item}
            whileHover={item.whileHover}
            
            className="cursor-pointer bg-gradient-to-br from-green-100 to-green-300 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-green-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-900">Resolved Complaints</p>
                <p className="text-3xl font-bold text-green-800">{stats.resolvedComplaints}</p>
              </div>
              <div className="p-3 rounded-full bg-green-200 text-green-700 text-xl">✅</div>
            </div>
          </motion.div>

          {/* Rooms Status */}
          <motion.div
            variants={item}
            whileHover={item.whileHover}
           
            className="cursor-pointer bg-gradient-to-br from-indigo-100 to-indigo-300 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-indigo-600"
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-indigo-900">Total Rooms</p>
                <p className="text-xl font-bold text-indigo-800">{stats.totalRooms}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-indigo-900">Occupied</p>
                <p className="text-xl font-bold text-indigo-800">{stats.occupiedRooms}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-indigo-900">Available</p>
                <p className="text-xl font-bold text-indigo-800">{stats.availableRooms}</p>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600" 
                  style={{ width: `${(stats.occupiedRooms / stats.totalRooms) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Announcements Section */}
        <motion.div
          variants={item}
          className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mb-8 overflow-hidden"
        >
          <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Latest Announcements
            </h3>
            <button
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full text-sm font-semibold shadow-md transition-all"
              onClick={() => navigate("/addannoucement")}
            >
              + Add Announcement
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {announcements.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No announcements found
              </div>
            ) : (
              announcements.map((announcement) => (
                <motion.div 
                  key={announcement._id}
                  whileHover={{ backgroundColor: '#fffaf5' }}
                  className="p-6 transition-colors duration-200"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 text-2xl mr-4 mt-1 text-orange-500">
                      {getAnnouncementIcon(announcement.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-gray-800 mb-1 capitalize">
                          {announcement.type} Announcement
                        </h4>
                        <span className="text-xs text-gray-400">
                          {formatDate(announcement.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 whitespace-pre-line">
                        {announcement.description}
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          {announcement.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;