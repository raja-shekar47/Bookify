import { useEffect, useMemo, useState } from "react";
import { BedDouble, CarFront, Check, Trash2, X } from "lucide-react";
import API, { getErrorMessage } from "../../services/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import StatusBadge from "../../components/StatusBadge";
import { EmptyState, ErrorState, Spinner } from "../../components/Feedback";
import { formatCurrency, formatDate } from "../../utils/format";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

const BookingsAdmin = ({ onChanged }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load bookings."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((b) => b.status === filter),
    [bookings, filter],
  );

  const setStatus = async (booking, status) => {
    try {
      setBusyId(booking._id);
      const { data } = await API.patch(`/bookings/${booking._id}/status`, {
        status,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, ...data } : b)),
      );
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update the booking."));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/bookings/${deleteTarget._id}`);
      setBookings((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      setDeleteTarget(null);
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the booking."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading bookings…" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => {
            const count =
              key === "all"
                ? bookings.length
                : bookings.filter((b) => b.status === key).length;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === key
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <button type="button" onClick={load} className="btn-ghost">
          Refresh
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && visible.length === 0 && (
        <EmptyState
          title={
            filter === "all" ? "No bookings yet" : `No ${filter} bookings`
          }
          description="Bookings placed from the guest site land here for you to confirm."
        />
      )}

      {!error && visible.length > 0 && (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Ref</th>
                  <th className="px-5 py-3 font-semibold">Guest</th>
                  <th className="px-5 py-3 font-semibold">Booked</th>
                  <th className="px-5 py-3 font-semibold">Dates</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-semibold text-slate-900">
                        {booking.reference}
                      </span>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {formatDate(booking.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-900">
                        {booking.name}
                      </p>
                      <p className="text-xs text-slate-500">{booking.mobile}</p>
                      <p className="text-xs text-slate-500">{booking.email}</p>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {booking.kind === "room" ? (
                          <BedDouble className="h-4 w-4 shrink-0 text-brand-600" />
                        ) : (
                          <CarFront className="h-4 w-4 shrink-0 text-brand-600" />
                        )}
                        <span className="text-slate-700">
                          {booking.itemTitle}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                        {booking.kind === "room" && booking.rooms > 1
                          ? ` · ${booking.rooms} rooms`
                          : ""}
                      </p>
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      <p>{formatDate(booking.checkIn)}</p>
                      <p className="text-xs text-slate-500">
                        → {formatDate(booking.checkOut)} · {booking.nights}n
                      </p>
                    </td>

                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {formatCurrency(booking.totalAmount)}
                    </td>

                    <td className="px-5 py-3">
                      <StatusBadge status={booking.status} />
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        {booking.status !== "confirmed" && (
                          <button
                            type="button"
                            disabled={busyId === booking._id}
                            onClick={() => setStatus(booking, "confirmed")}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-40"
                            aria-label="Confirm booking"
                            title="Confirm"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {booking.status !== "cancelled" && (
                          <button
                            type="button"
                            disabled={busyId === booking._id}
                            onClick={() => setStatus(booking, "cancelled")}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600 disabled:opacity-40"
                            aria-label="Cancel booking"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(booking)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete booking"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this booking?"
        message={`Booking ${deleteTarget?.reference} for ${deleteTarget?.name} will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </div>
  );
};

export default BookingsAdmin;
