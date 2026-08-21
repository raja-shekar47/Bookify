import { useCallback, useEffect, useMemo, useState } from "react";
import API, { TOKEN_KEY, getErrorMessage } from "../services/api";
import { AuthContext, isAdminRole, isSuperAdminRole } from "./authStore";

/**
 * Restores the session from the saved token on boot and exposes the current
 * user to the app. The token itself lives in localStorage; the axios
 * interceptor in services/api.js attaches it to every request.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const restore = useCallback(async () => {
    try {
      setLoading(true);

      if (!localStorage.getItem(TOKEN_KEY)) {
        setUser(null);
        return;
      }

      const { data } = await API.get("/auth/me");
      setUser(data.user);
    } catch {
      // Expired or tampered token — the interceptor already cleared it.
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restore();
  }, [restore]);

  // The axios interceptor fires this when any request comes back 401.
  useEffect(() => {
    const onSignedOut = () => setUser(null);
    window.addEventListener("aaron-stays:signed-out", onSignedOut);
    return () =>
      window.removeEventListener("aaron-stays:signed-out", onSignedOut);
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err, "Could not sign in.") };
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
      refresh: restore,
      isAuthenticated: Boolean(user),
      isAdmin: isAdminRole(user?.role),
      isSuperAdmin: isSuperAdminRole(user?.role),
    }),
    [user, loading, signIn, signOut, restore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
