import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = formData;
      await axiosInstance.post("/users/login", {
        email, password
      })
      console.log("Login Data:", formData);
      alert("Logged In Successfully!");
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error("Error during sign-in:", error.response?.data || error.message);
      alert("Sign-Up Failed. Please try again.");
    }

    console.log("Login Data:", formData);
    alert("Logged In Successfully!");
    navigate("/"); // Redirect to home after login
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input ref={emailRef}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
          <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="enter password"
        className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full pr-10"
        required
      />
      <div
        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        onClick={togglePasswordVisibility} // Toggle password visibility on click
      >
        {showPassword ? (
          <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-blue-500" />
        ) : (
          <EyeIcon className="h-5 w-5 text-gray-500 hover:text-blue-500" />
        )}
      </div>
    </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
