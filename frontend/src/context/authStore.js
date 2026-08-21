import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

/** Current signed-in user, plus signIn/signOut helpers. */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export const isAdminRole = (role) => role === "admin" || role === "superadmin";
export const isSuperAdminRole = (role) => role === "superadmin";

export const ROLE_LABELS = {
  superadmin: "Super admin",
  admin: "Admin",
  user: "User",
};
