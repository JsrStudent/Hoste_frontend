import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import BASE_URL from '../api/config';

const AllStudentDetail = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${BASE_URL}/route/admin/student_detail`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roomno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student permanently?')) return;
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${BASE_URL}/route/admin/delete_user/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Student deleted successfully');
        fetchStudents();
      } else {
        toast.error(data.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          // animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-blue-200"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <motion.h1 
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Student Management
          </motion.h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search students..."
              className="px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-white text-indigo-600 rounded-full shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
          <div className="hidden md:grid grid-cols-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 font-medium text-sm">
            <div className="col-span-2">Name</div>
            <div className="col-span-2">Registration No</div>
            <div className="col-span-2">Email</div>
            <div className="col-span-1">Phone</div>
            <div className="col-span-1">Room No</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No matching students found' : 'No students found'}
              </p>
            </div>
          ) : (
            <div>
              {filteredStudents.map((student) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center p-4 border-b border-gray-100 gap-y-2 md:gap-0 hover:bg-gray-50 transition-all text-sm"
                >
                  <div className="md:col-span-2 font-medium text-indigo-700">{student.name}</div>
                  <div className="md:col-span-2 text-gray-600">{student.regno}</div>
                  <div className="md:col-span-2 text-gray-600 truncate pr-4">{student.email}</div>
                  <div className="md:col-span-1 text-gray-600">{student.phoneno}</div>
                  <div className="md:col-span-1 text-gray-600">{student.roomno}</div>
                  <div className="md:col-span-2">
                    <span className="px-4 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      Active
                    </span>
                  </div>
                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/admin/students/edit/${student._id}`)}
                      className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs"
                      title="Edit Student"
                    >
                      ✏️ Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteStudent(student._id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs"
                      title="Delete Student"
                    >
                      🗑️ Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-gray-600 text-sm">
            Showing {filteredStudents.length} of {students.length} students
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={fetchStudents}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-all"
            >
              🔄 Refresh List
            </button>
            <button 
              onClick={() => navigate('/admin/students/add')}
              className="px-6 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all"
            >
              ➕ Add New Student
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AllStudentDetail;
