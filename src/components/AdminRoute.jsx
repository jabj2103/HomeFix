import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, userHasLabel } from "../services/authService";

function AdminRoute({ children }) {
  const location = useLocation();
  const [access, setAccess] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      const user = await getCurrentUser();

      if (isMounted) {
        setAccess({ loading: false, user });
      }
    }

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (access.loading) {
    return <main className="admin-access-state">Verificando acceso...</main>;
  }

  if (!access.user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!userHasLabel(access.user, "admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
