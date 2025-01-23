import { Navigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axiosInstance.get("/users/verify"); 
        if (response.status === 200) {
          setIsAuthenticated(true); 
        }
      } catch (error) {
        console.error("User not authenticated:", error);
        setIsAuthenticated(false); // Token is invalid
      }
    };

    verifyUser();
  }, []);

  // Wait for authentication check
  if (isAuthenticated === null) return <div>Loading...</div>;

  // Redirect if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Render protected content
  return children;
};

export default ProtectedRoute;
