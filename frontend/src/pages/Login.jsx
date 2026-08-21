import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, Mountain } from "lucide-react";
import { useAuth } from "../context/authStore";
import { SITE } from "../config/site";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/admin";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    const result = await signIn(form.email.trim(), form.password);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    // Staff land in the console; everyone else goes back to the site.
    const isStaff = ["admin", "superadmin"].includes(result.user.role);
    navigate(isStaff ? from : "/", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>

        <div className="card-surface overflow-hidden">
          <div className="border-b border-slate-100 px-8 py-7 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-600/25">
              <Mountain className="h-6 w-6 text-white" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold text-slate-900">
              {SITE.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to the admin console
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-8 py-7" noValidate>
            <div>
              <label className="field-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="field-input"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="field-input"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Staff access only. Guests can book without an account.
        </p>
      </div>
    </div>
  );
};

export default Login;
