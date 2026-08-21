const TONES = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  booked: "bg-amber-50 text-amber-700 ring-amber-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  maintenance: "bg-slate-100 text-slate-600 ring-slate-500/20",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const LABELS = {
  available: "Available",
  booked: "Booked",
  maintenance: "Under maintenance",
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

const StatusBadge = ({ status, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
      TONES[status] || TONES.maintenance
    } ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {LABELS[status] || status}
  </span>
);

export default StatusBadge;
