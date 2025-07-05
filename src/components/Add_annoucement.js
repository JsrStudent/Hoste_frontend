import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config";


const AddAnnouncement = () => {
  const [form, setForm] = useState({ type: "other", description: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch(`${BASE_URL}/route/admin/add_annoucement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Announcement added successfully!");
        navigate("/admin-dashboard");
      } else {
        toast.error(data.message || "Failed to add announcement");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while adding announcement");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add New Announcement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="electricity">Electricity</option>
              <option value="internet">Internet</option>
              <option value="other">Other</option>
              <option value="college">College</option>
              <option value="sports">Sports</option>
              <option value="mess">Mess</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Write your announcement here..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
          >
            Add Announcement
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncement;
