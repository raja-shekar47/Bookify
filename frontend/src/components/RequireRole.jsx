import { Link, Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../context/authStore";
import { Spinner } from "./Feedback";

/**
 * Route guard.
 *
 * - Not signed in        → bounced to /login, remembering where they wanted to go
 * - Signed in, no rights → shown a "not permitted" screen rather than a redirect
 *                          loop, so it's obvious what happened
 *
 * @param {"admin"|"superadmin"} role minimum role required
 */
const RequireRole = ({ role = "admin", children }) => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Checking your access…" />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const permitted = role === "superadmin" ? isSuperAdmin : isAdmin;

  if (!permitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="card-surface max-w-md px-8 py-10 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-rose-50 text-rose-600">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-slate-900">
            Not permitted
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your account doesn't have access to this area. Ask the super admin
            to grant you admin rights.
          </p>
          <Link to="/" className="btn-primary mt-6">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireRole;
