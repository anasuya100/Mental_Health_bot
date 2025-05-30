import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loader from "./Loader";


const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://menatl-bot-service.onrender.com/auth/authstatus/",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.authenticated) {
          navigate(`/chats/${data.user_id}`);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("username", formData.email);
    urlEncodedData.append("password", formData.password);

    try {
      const response = await fetch(
        "https://menatl-bot-service.onrender.com/auth/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlEncodedData.toString(),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        const id = result["user_id"];
        navigate(`/chats/${id}`);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }

    setFormData({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        {loading && <Loader />}
      
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Company Logo" className="h-12" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white text-center mb-1">
          Sign In to Your Account
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Welcome back! Please enter your details.
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-gray-300 text-black font-semibold py-2 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/" className="text-white hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
