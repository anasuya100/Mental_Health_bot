import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import ChatPage from './ChatPage'

const Loginroute = () => {
  const token = Cookies.get("access_token")
  if (token){
    console.log("token")
  }
  else {
    console.log("cant accesss")
  }

  return token ? <ChatPage /> : <Navigate to="/"/>;
};

export default Loginroute;