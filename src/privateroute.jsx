import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://mental-rwqo.onrender.com/api/authstatus/",{
          method : "GET",
          credentials: "include", 
        });

        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []); // Empty dependency array ensures it runs only once

  if (isAuthenticated === null) return <p>Loading...</p>; // Prevent flickering

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
