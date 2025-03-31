import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({username:"", email: "", password: "" });
  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://mental-rwqo.onrender.com/api/authstatus/",{
          method : "GET",
          credentials: "include", 
        })
        const data = await response.json();
        if(data.authenticated){
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
    const email = formData.email
    const username = formData.username
    const password = formData.password

    const response = await fetch("https://mental-rwqo.onrender.com/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username" : username,
        "email" : email,
        "set_password" : password
      }),
      credentials : "include",
    });
    if(response.ok){
      const result = await response.json()
      var id = result['user_id']
      console.log(result)
      navigate(`chats/${id}`)
    }
    setFormData({username:"", email: "", password: "" });
  }; 
  return (
    <div className="relative h-screen bg-black text-white flex items-center justify-center">
      <img
        src="/Background.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative bg-black bg-opacity-75 p-10 rounded-lg w-96">
        <h2 className="text-3xl font-bold mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Provide your username"
            className="w-full p-3 mb-4 bg-gray-800 rounded focus:outline-none"
          />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email or mobile number"
            className="w-full p-3 mb-4 bg-gray-800 rounded focus:outline-none"
          />
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 mb-4 bg-gray-800 rounded focus:outline-none"
          />
          <button type="submit" className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-red-700">Sign In</button>
        </form>
        <div className="flex justify-between text-gray-400 text-sm mt-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
