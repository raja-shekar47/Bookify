import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import API, { getErrorMessage } from "../../services/api";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import SmartImage from "../../components/SmartImage";
import StatusBadge from "../../components/StatusBadge";
import { EmptyState, ErrorState, Spinner } from "../../components/Feedback";
import { formatCurrency } from "../../utils/format";
import { SITE } from "../../config/site";

const VEHICLE_TYPES = [
  "Hatchback",
  "Sedan",
  "SUV",
  "Tempo Traveller",
  "Jeep",
  "Bike",
];

const emptyVehicle = {
  name: "",
  image: "",
  type: "Sedan",
  pricePerDay: "",
  seats: 4,
  ac: "true",
  driverName: "",
  contactNumber: SITE.phone,
  description: "",
  status: "available",
};

const TransportAdmin = ({ onChanged }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyVehicle);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/transport");
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load vehicles."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyVehicle);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setForm({
      name: vehicle.name || "",
      image: vehicle.image || "",
      type: vehicle.type || "Sedan",
      pricePerDay: vehicle.pricePerDay ?? "",
      seats: vehicle.seats || 4,
      ac: String(vehicle.ac ?? true),
      driverName: vehicle.driverName || "",
      contactNumber: vehicle.contactNumber || SITE.phone,
      description: vehicle.description || "",
      status: vehicle.status || "available",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setFormError("Vehicle name is required.");
    if (!form.image.trim()) return setFormError("An image URL is required.");
    if (
      form.pricePerDay === "" ||
      Number.isNaN(Number(form.pricePerDay)) ||
      Number(form.pricePerDay) < 0
    )
      return setFormError("Enter a valid price per day.");
    if (!/^[0-9]{10}$/.test(form.contactNumber.trim()))
      return setFormError("Contact number must be 10 digits.");

    const payload = {
      ...form,
      pricePerDay: Number(form.pricePerDay),
      seats: Number(form.seats),
      ac: form.ac === "true",
      contactNumber: form.contactNumber.trim(),
    };

    try {
      setSaving(true);
      setFormError("");

      if (editingId) {
        await API.put(`/transport/${editingId}`, payload);
      } else {
        await API.post("/transport", payload);
      }

      setModalOpen(false);
      await load();
      onChanged?.();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save the vehicle."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/transport/${deleteTarget._id}`);
      setDeleteTarget(null);
      await load();
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the vehicle."));
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (vehicle) => {
    const next = vehicle.status === "available" ? "booked" : "available";
    try {
      await API.put(`/transport/${vehicle._id}`, { status: next });
      setVehicles((prev) =>
        prev.map((v) => (v._id === vehicle._id ? { ...v, status: next } : v)),
      );
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update status."));
    }
  };

  if (loading) return <Spinner label="Loading vehicles…" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          <strong className="font-semibold text-slate-900">
            {vehicles.length}
          </strong>{" "}
          vehicle{vehicles.length === 1 ? "" : "s"} in the fleet
        </p>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add vehicle
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && vehicles.length === 0 && (
        <EmptyState
          title="No vehicles yet"
          description="Add cars, SUVs or tempo travellers so guests can book transport."
          action={
            <button type="button" onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" /> Add vehicle
            </button>
          }
        />
      )}

      {!error && vehicles.length > 0 && (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Vehicle</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Per day</th>
                  <th className="px-5 py-3 font-semibold">Seats</th>
                  <th className="px-5 py-3 font-semibold">Driver</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <SmartImage
                          src={vehicle.image}
                          alt={vehicle.name}
                          fallbackLabel="No photo"
                          className="h-12 w-16 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {vehicle.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {vehicle.ac ? "AC" : "Non-AC"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{vehicle.type}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {formatCurrency(vehicle.pricePerDay)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {vehicle.seats}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <p>{vehicle.driverName || "—"}</p>
                      <p className="text-xs text-slate-500">
                        {vehicle.contactNumber}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(vehicle)}
                        title="Click to toggle"
                      >
                        <StatusBadge status={vehicle.status} />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(vehicle)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          aria-label={`Edit ${vehicle.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(vehicle)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${vehicle.name}`}
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

      {/* ---------------- Add / edit modal ---------------- */}
      <Modal
        open={modalOpen}
        title={editingId ? "Edit vehicle" : "Add a vehicle"}
        subtitle="These appear on the public Transport page."
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="v-name">
                Vehicle name *
              </label>
              <input
                id="v-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Toyota Innova Crysta"
                className="field-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="v-image">
                Image URL or path *
              </label>
              <input
                id="v-image"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://… or /images/transport/innova.jpg"
                className="field-input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="v-type">
                Vehicle type
              </label>
              <select
                id="v-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="field-input"
              >
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="v-price">
                Price per day (₹) *
              </label>
              <input
                id="v-price"
                name="pricePerDay"
                type="number"
                min="0"
                value={form.pricePerDay}
                onChange={handleChange}
                placeholder="3500"
                className="field-input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="v-seats">
                Seats
              </label>
              <input
                id="v-seats"
                name="seats"
                type="number"
                min="1"
                value={form.seats}
                onChange={handleChange}
                className="field-input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="v-ac">
                Air conditioning
              </label>
              <select
                id="v-ac"
                name="ac"
                value={form.ac}
                onChange={handleChange}
                className="field-input"
              >
                <option value="true">AC</option>
                <option value="false">Non-AC</option>
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="v-driver">
                Driver name
              </label>
              <input
                id="v-driver"
                name="driverName"
                value={form.driverName}
                onChange={handleChange}
                placeholder="Raja Shekar"
                className="field-input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="v-contact">
                Contact number *
              </label>
              <input
                id="v-contact"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="7094929674"
                className="field-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="v-description">
                Description
              </label>
              <textarea
                id="v-description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Routes covered, luggage space, anything a guest should know."
                className="field-input resize-none"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="v-status">
                Status
              </label>
              <select
                id="v-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="field-input"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Under maintenance</option>
              </select>
            </div>
          </div>

          {formError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving…" : editingId ? "Save changes" : "Add vehicle"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this vehicle?"
        message={`"${deleteTarget?.name}" will be removed from the Transport page.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </div>
  );
};

export default TransportAdmin;
