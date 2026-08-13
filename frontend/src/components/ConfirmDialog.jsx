import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  busy = false,
}) => (
  <Modal open={open} title={title} onClose={onCancel} size="sm">
    <div className="flex gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <p className="text-sm leading-relaxed text-slate-600">{message}</p>
    </div>

    <div className="mt-6 flex justify-end gap-3">
      <button type="button" onClick={onCancel} className="btn-ghost">
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:bg-slate-300"
      >
        {busy ? "Working…" : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
