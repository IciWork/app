import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { getAuthSession } from "@/lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<"client" | "provider">;
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const session = getAuthSession();

  if (!session) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/connexion-client?next=${next}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

