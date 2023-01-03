import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Auth from "../components/Auth/Auth";
import { SessionContext } from "../context/session";

const ProtectedRoutes = () => {
  const session = useContext(SessionContext);

  return session && session?.user.id ? <Outlet /> : <Auth />;
};

export default ProtectedRoutes;
