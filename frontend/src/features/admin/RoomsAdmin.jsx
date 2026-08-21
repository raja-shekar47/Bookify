import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import API, { getErrorMessage } from "../../services/api";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImageField from "../../components/ImageField";
import SmartImage from "../../components/SmartImage";
import StatusBadge from "../../components/StatusBadge";
import { EmptyState, ErrorState, Spinner } from "../../components/Feedback";
import { formatCurrency } from "../../utils/format";

const ROOM_TYPES = [
  "Standard Room",
  "Deluxe Room",
  "Family Suite",
  "Apartment",
];

const emptyRoom = {
  title: "",
  image: "",
  type: "Standard Room",
  price: "",
  address: "Aaron Stays, Ooty, The Nilgiris, Tamil Nadu 643001",
  description: "",
  maxGuests: 2,
  beds: 1,
  bathrooms: 1,
  amenities: "",
  status: "available",
};

const RoomsAdmin = ({ onChanged }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRoom);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/rooms");
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load rooms."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyRoom);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditingId(room._id);
    setForm({
      title: room.title || "",
      image: room.image || "",
      type: room.type || "Standard Room",
      price: room.price ?? "",
      address: room.address || "",
      description: room.description || "",
      maxGuests: room.maxGuests || 2,
      beds: room.beds || 1,
      bathrooms: room.bathrooms || 1,
      amenities: (room.amenities || []).join(", "),
      status: room.status || "available",
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

    if (!form.title.trim()) return setFormError("Room title is required.");
    if (!form.image.trim()) return setFormError("An image URL or path is required.");
    if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) < 0)
      return setFormError("Enter a valid price.");
    if (!form.address.trim()) return setFormError("Address is required.");

    const payload = {
      ...form,
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
      beds: Number(form.beds),
      bathrooms: Number(form.bathrooms),
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);
      setFormError("");

      if (editingId) {
        await API.put(`/rooms/${editingId}`, payload);
      } else {
        await API.post("/rooms", payload);
      }

      setModalOpen(false);
      await load();
      onChanged?.();
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save the room."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/rooms/${deleteTarget._id}`);
      setDeleteTarget(null);
      await load();
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the room."));
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (room) => {
    const next = room.status === "available" ? "booked" : "available";
    try {
      await API.put(`/rooms/${room._id}`, { status: next });
      setRooms((prev) =>
        prev.map((r) => (r._id === room._id ? { ...r, status: next } : r)),
      );
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update status."));
    }
  };

  if (loading) return <Spinner label="Loading rooms…" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          <strong className="font-semibold text-slate-900">
            {rooms.length}
          </strong>{" "}
          room{rooms.length === 1 ? "" : "s"} listed
        </p>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add room
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && rooms.length === 0 && (
        <EmptyState
          title="No rooms yet"
          description="Add your first room so guests can start booking."
          action={
            <button type="button" onClick={openCreate} className="btn-primary">
              <Plus className="h-4 w-4" /> Add room
            </button>
          }
        />
      )}

      {!error && rooms.length > 0 && (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Room</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Sleeps</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <SmartImage
                          src={room.image}
                          alt={room.title}
                          fallbackLabel="No photo"
                          className="h-12 w-16 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {room.title}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {room.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{room.type}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {formatCurrency(room.price)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {room.maxGuests}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(room)}
                        title="Click to toggle"
                      >
                        <StatusBadge status={room.status} />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(room)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          aria-label={`Edit ${room.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(room)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${room.title}`}
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
        title={editingId ? "Edit room" : "Add a new room"}
        subtitle="Guests see these details on the room page."
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="r-title">
                Room title *
              </label>
              <input
                id="r-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Deluxe Double Room"
                className="field-input"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageField
                label="Room photo *"
                value={form.image}
                onChange={(image) => {
                  setForm((prev) => ({ ...prev, image }));
                  setFormError("");
                }}
                hint="Paste any public image address ending in .jpg, .png or .webp."
              />
            </div>

            <div>
              <label className="field-label" htmlFor="r-type">
                Room type
              </label>
              <select
                id="r-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="field-input"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="r-price">
                Price per night (₹) *
              </label>
              <input
                id="r-price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="2500"
                className="field-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="r-address">
                Address *
              </label>
              <input
                id="r-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="field-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="r-description">
                Description
              </label>
              <textarea
                id="r-description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="What makes this room worth booking?"
                className="field-input resize-none"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="r-maxGuests">
                Max guests
              </label>
              <input
                id="r-maxGuests"
                name="maxGuests"
                type="number"
                min="1"
                value={form.maxGuests}
                onChange={handleChange}
                className="field-input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="r-beds">
                Beds
              </label>
              <input
                id="r-beds"
                name="beds"
                type="number"
                min="1"
                value={form.beds}
                onChange={handleChange}
                className="field-input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="r-bathrooms">
                Bathrooms
              </label>
              <input
                id="r-bathrooms"
                name="bathrooms"
                type="number"
                min="1"
                value={form.bathrooms}
                onChange={handleChange}
                className="field-input"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="r-status">
                Status
              </label>
              <select
                id="r-status"
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

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="r-amenities">
                Amenities (comma separated)
              </label>
              <input
                id="r-amenities"
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="Free WiFi, Hot water 24/7, Free parking"
                className="field-input"
              />
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
              {saving ? "Saving…" : editingId ? "Save changes" : "Add room"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this room?"
        message={`"${deleteTarget?.title}" will be removed from the site. Existing bookings keep their record but will no longer link to a room.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </div>
  );
};

export default RoomsAdmin;
