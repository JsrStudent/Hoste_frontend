import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../api/config';
export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("pendingEmail"); // ✅ stored after signup-request

    if (!email) {
      alert("No email found. Please signup again.");
      navigate("/signup");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/route/verify-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Registration successful! Please login.");
        localStorage.removeItem("pendingEmail"); // cleanup
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("❌ OTP verification failed. Try again.");
      console.error("Verify error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the OTP sent to your college email
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg tracking-widest"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
