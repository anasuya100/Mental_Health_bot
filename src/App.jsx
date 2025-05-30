import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Signin from './Signin';
import ChatPage from './ChatPage';
import PrivateRoute from './privateroute';



const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
   

    // Simulate small delay to show animation (can be removed)
    const timer = setTimeout(() => {
      
    }, 300); // You can reduce this delay

    return () => clearTimeout(timer);
  }, [location]);

  return null;
};

const App = () => {
  return (
    <Router>
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/chats/:pk" element={<ChatPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
