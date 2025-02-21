import React from 'react'
import Login from './Login'
import ChatPage from './ChatPage'
import PrivateRoute from './privateroute';
import Loginroute from './loginprivate';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import daisyui from 'daisyui';

const App = () => {
  return (
     <Router>
      <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<PrivateRoute />}>
          <Route path="/chats/:pk" element={<ChatPage />} />
      </Route>
      </Routes>
    </Router>
  )
}

export default App
