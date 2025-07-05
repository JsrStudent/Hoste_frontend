import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import BASE_URL from '../api/config';

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'resolved'
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${BASE_URL}/route/admin/get/all_complain`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setComplaints(data.data);
      } else {
        toast.error('Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (complaintId, elementId, currentStatus) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${BASE_URL}/route/admin/update/${complaintId}/${elementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Complaint marked as ${!currentStatus ? 'Resolved' : 'Pending'}`);
        fetchComplaints();
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const deleteComplaint = async (complaintId, elementId) => {
    if (!window.confirm('Delete this complaint permanently?')) return;

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${BASE_URL}/route/delete/complain/${complaintId}/${elementId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Complaint deleted');
        fetchComplaints();
      }
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-700">Complaint Management</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:shadow-md transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              filter === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Resolved
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md">
          {/* Header for md+ */}
          <div className="hidden md:grid grid-cols-12 bg-indigo-600 text-white p-4 font-semibold text-sm">
            <div className="col-span-2">Student</div>
            <div className="col-span-1">Room</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-1">Image</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Actions</div>
          </div>

          {complaints.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No complaints found.</div>
          ) : (
            complaints.map((student) =>
              student.complaints
                .filter((complaint) => {
                  if (filter === 'all') return true;
                  if (filter === 'pending') return !complaint.status;
                  if (filter === 'resolved') return complaint.status;
                  return true;
                })
                .map((complaint) => (
                  <div
                    key={complaint._id}
                    className="grid grid-cols-1 md:grid-cols-12 p-4 border-b text-sm hover:bg-gray-50 transition gap-2"
                  >
                    <div className="md:col-span-2">
                      <div className="font-medium text-indigo-700">{student.regno}</div>
                      <div className="text-xs text-gray-500 md:hidden">Room: {student.roomno}</div>
                    </div>

                    <div className="md:col-span-1 hidden md:block">{student.roomno}</div>
                    <div className="md:col-span-1 capitalize">{complaint.type}</div>
                    <div className="md:col-span-3 text-gray-700 truncate">{complaint.comments}</div>
                    <div className="md:col-span-1">
                      {complaint.url && (
                        <a
                          href={complaint.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </a>
                      )}
                    </div>
                    <div className="md:col-span-1">
                      <span
                        onClick={() => updateStatus(student._id, complaint._id, complaint.status)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer inline-block text-center ${
                          complaint.status
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {complaint.status ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    <div className="md:col-span-2 text-gray-500 text-xs">
                      {formatDate(complaint.createdAt)}
                    </div>
                    <div className="md:col-span-1 flex justify-start md:justify-center">
                      <button
                        onClick={() => deleteComplaint(student._id, complaint._id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
            )
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            Showing{' '}
            {
              complaints.reduce(
                (acc, student) =>
                  acc +
                  student.complaints.filter((complaint) => {
                    if (filter === 'all') return true;
                    if (filter === 'pending') return !complaint.status;
                    if (filter === 'resolved') return complaint.status;
                    return true;
                  }).length,
                0
              )
            }{' '}
            complaints
          </div>
          <button
            onClick={fetchComplaints}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllComplaints;
