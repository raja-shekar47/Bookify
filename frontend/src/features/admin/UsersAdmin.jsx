import { useEffect, useState } from "react";
import { KeyRound, Plus, ShieldCheck, Trash2, UserCog } from "lucide-react";
import API, { getErrorMessage } from "../../services/api";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { EmptyState, ErrorState, Spinner } from "../../components/Feedback";
import { ROLE_LABELS, useAuth } from "../../context/authStore";
import { formatDate } from "../../utils/format";

const emptyUser = { name: "", email: "", password: "", role: "user" };

const RoleBadge = ({ role }) => {
  const tone =
    role === "superadmin"
      ? "bg-brand-50 text-brand-700 ring-brand-600/20"
      : role === "admin"
        ? "bg-sky-50 text-sky-700 ring-sky-600/20"
        : "bg-slate-100 text-slate-600 ring-slate-500/20";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}
    >
      {role !== "user" && <ShieldCheck className="h-3 w-3" />}
      {ROLE_LABELS[role] || role}
    </span>
  );
};

const UsersAdmin = () => {
  const { user: me } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [pwTarget, setPwTarget] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setFormError("Name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return setFormError("Enter a valid email address.");
    if (form.password.length < 6)
      return setFormError("Password must be at least 6 characters.");

    try {
      setSaving(true);
      setFormError("");

      const { data } = await API.post("/users", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      setUsers((prev) => [data, ...prev]);
      setForm(emptyUser);
      setAddOpen(false);
      setNotice(
        `${data.name} added as ${ROLE_LABELS[data.role]}. Share the password with them.`,
      );
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not add this person."));
    } finally {
      setSaving(false);
    }
  };

  const setRole = async (target, role) => {
    try {
      setBusyId(target._id);
      setError("");
      const { data } = await API.patch(`/users/${target._id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === data._id ? data : u)));
      setNotice(`${data.name} is now ${ROLE_LABELS[data.role]}.`);
    } catch (err) {
      setError(getErrorMessage(err, "Could not change the role."));
    } finally {
      setBusyId(null);
    }
  };

  const setActive = async (target, active) => {
    try {
      setBusyId(target._id);
      setError("");
      const { data } = await API.patch(`/users/${target._id}/active`, {
        active,
      });
      setUsers((prev) => prev.map((u) => (u._id === data._id ? data : u)));
    } catch (err) {
      setError(getErrorMessage(err, "Could not update this account."));
    } finally {
      setBusyId(null);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }

    try {
      setPwSaving(true);
      setPwError("");
      await API.patch(`/users/${pwTarget._id}/password`, {
        password: newPassword,
      });
      setNotice(`Password reset for ${pwTarget.name}.`);
      setPwTarget(null);
      setNewPassword("");
    } catch (err) {
      setPwError(getErrorMessage(err, "Could not reset the password."));
    } finally {
      setPwSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(getErrorMessage(err, "Could not remove this person."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading people…" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          <strong className="font-semibold text-slate-900">
            {users.length}
          </strong>{" "}
          {users.length === 1 ? "person" : "people"} ·{" "}
          {users.filter((u) => u.role !== "user").length} with admin rights
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(emptyUser);
            setFormError("");
            setAddOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Add person
        </button>
      </div>

      {notice && (
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 ring-1 ring-inset ring-brand-600/15">
          {notice}
        </p>
      )}

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && users.length === 0 && (
        <EmptyState
          title="No one here yet"
          description="Add a person, then promote them to admin so they can manage the property."
        />
      )}

      {!error && users.length > 0 && (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Person</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Last sign-in</th>
                  <th className="px-5 py-3 font-semibold">Access</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((person) => {
                  const isSelf = person._id === me?._id;
                  const isSuper = person.role === "superadmin";
                  const busy = busyId === person._id;

                  return (
                    <tr key={person._id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                            {person.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {person.name}
                              {isSelf && (
                                <span className="ml-2 text-xs font-medium text-slate-400">
                                  (you)
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {person.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <RoleBadge role={person.role} />
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {person.lastLoginAt
                          ? formatDate(person.lastLoginAt)
                          : "Never"}
                      </td>

                      <td className="px-5 py-3">
                        {isSuper ? (
                          <span className="text-xs text-slate-400">
                            Always active
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setActive(person, !person.active)}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition disabled:opacity-40 ${
                              person.active
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                                : "bg-slate-100 text-slate-500 ring-slate-500/20"
                            }`}
                          >
                            {person.active ? "Active" : "Suspended"}
                          </button>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          {/* Promote / demote */}
                          {!isSuper && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                setRole(
                                  person,
                                  person.role === "admin" ? "user" : "admin",
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"
                              title={
                                person.role === "admin"
                                  ? "Remove admin rights"
                                  : "Make admin"
                              }
                            >
                              <UserCog className="h-4 w-4" />
                              {person.role === "admin"
                                ? "Make user"
                                : "Make admin"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setPwTarget(person);
                              setNewPassword("");
                              setPwError("");
                            }}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label={`Reset password for ${person.name}`}
                            title="Reset password"
                          >
                            <KeyRound className="h-4 w-4" />
                          </button>

                          {!isSuper && !isSelf && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(person)}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                              aria-label={`Remove ${person.name}`}
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- Add person ---------------- */}
      <Modal
        open={addOpen}
        title="Add a person"
        subtitle="They can sign in at /login with these details."
        onClose={() => setAddOpen(false)}
        size="md"
      >
        <form onSubmit={handleAdd} className="space-y-4" noValidate>
          <div>
            <label className="field-label" htmlFor="u-name">
              Full name *
            </label>
            <input
              id="u-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Priya Kumar"
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="u-email">
              Email *
            </label>
            <input
              id="u-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="priya@example.com"
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="u-password">
              Temporary password *
            </label>
            <input
              id="u-password"
              name="password"
              type="text"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="field-input"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Share this with them — they can change it after signing in.
            </p>
          </div>

          <div>
            <label className="field-label" htmlFor="u-role">
              Role
            </label>
            <select
              id="u-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="field-input"
            >
              <option value="user">User — no console access</option>
              <option value="admin">
                Admin — manage rooms, transport, bookings
              </option>
            </select>
          </div>

          {formError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Adding…" : "Add person"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- Reset password ---------------- */}
      <Modal
        open={Boolean(pwTarget)}
        title="Reset password"
        subtitle={pwTarget ? `For ${pwTarget.name} (${pwTarget.email})` : ""}
        onClose={() => setPwTarget(null)}
        size="sm"
      >
        <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
          <div>
            <label className="field-label" htmlFor="u-newpw">
              New password
            </label>
            <input
              id="u-newpw"
              type="text"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPwError("");
              }}
              placeholder="At least 6 characters"
              className="field-input"
            />
          </div>

          {pwError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {pwError}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setPwTarget(null)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" disabled={pwSaving} className="btn-primary">
              {pwSaving ? "Saving…" : "Reset password"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove this person?"
        message={`${deleteTarget?.name} will lose access immediately and their account will be deleted.`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </div>
  );
};

export default UsersAdmin;
