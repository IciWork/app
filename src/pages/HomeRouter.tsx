import { Navigate } from "react-router-dom";
import Index from "./Index";
import { getAuthSession } from "@/lib/auth";

const HomeRouter = () => {
  const session = getAuthSession();

  if (!session) return <Index />;

  if (session.role === "provider") {
    return <Navigate to="/espace-prestataire" replace />;
  }

  return <Navigate to="/espace-client" replace />;
};

export default HomeRouter;

