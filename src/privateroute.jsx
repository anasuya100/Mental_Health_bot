import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import ChatPage from './ChatPage'

const PrivateRoute = () => {
  const token = Cookies.get("access_token")

  return token ? <Outlet/> : <Navigate to="/"/>;
};

export default PrivateRoute;
