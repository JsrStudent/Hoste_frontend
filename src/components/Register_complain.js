import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config";

export default function Register_complain() {
  const [comments, setComments] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("electricity");
  const [regno, setRegno] = useState("");

  const navigate = useNavigate();
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.regno) {
      setRegno(user.regno);
    }
  }, []);

  useEffect(() => {
    if (url) {
      submitComplaint(url);
    }
  }, [url]);

  const postComplaint = () => {
    if (!comments || !type) {
      notifyA("Please fill in all required fields");
      return;
    }

    if (image) {
      uploadToCloudinary();
    } else {
      // If no image, submit with default image or empty URL
      submitComplaint("https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png");
    }
  };

  const uploadToCloudinary = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta_clone"); // 👈 Your Cloudinary upload preset
    data.append("cloud_name", "dx0lfkfrj");       // 👈 Your Cloudinary cloud name

    fetch("https://api.cloudinary.com/v1_1/dx0lfkfrj/image/upload", {
      method: "POST",
      body: data
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setUrl(data.url);
        } else {
          notifyA("Image upload failed");
        }
      })
      .catch((err) => {
        console.error("Cloudinary upload error:", err);
        notifyA("Image upload error");
      });
  };

  const submitComplaint = (uploadedUrl) => {
    fetch(`${BASE_URL}/route/complain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        type,
        comments,
        url: uploadedUrl,
        regno
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          notifyB("Complaint submitted successfully");
          navigate("/student-dashboard");
        } else {
          notifyA(data.message || "Submission failed");
        }
      })
      .catch((err) => {
        console.error("Complaint error:", err);
        notifyA("Something went wrong");
      });
  };

  const loadfile = (event) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = () => URL.revokeObjectURL(output.src);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/student-dashboard")}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4 text-center">Submit a Complaint</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Type of Complaint</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="electricity">Electricity</option>
          <option value="internet">Internet</option>
          <option value="room">Room</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          placeholder="Describe the issue..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            loadfile(e);
            setImage(e.target.files[0]);
          }}
        />
        <img
          id="output"
          className="mt-2 w-32 h-32 object-cover border rounded"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
          alt="Preview"
        />
      </div>

      <button
        onClick={postComplaint}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Submit Complaint
      </button>
    </div>
  );
}
