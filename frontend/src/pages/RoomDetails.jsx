import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  MapPin,
  Users,
} from "lucide-react";
import API, { getErrorMessage } from "../services/api";
import SmartImage from "../components/SmartImage";
import StatusBadge from "../components/StatusBadge";
import Rating from "../components/Rating";
import { Spinner, ErrorState } from "../components/Feedback";
import BookingForm from "../features/booking/BookingForm";
import { SITE } from "../config/site";
import { formatCurrency } from "../utils/format";

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRoom = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get(`/rooms/${roomId}`);
      setRoom(data);
      setActiveImage(data.image);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load room details."));
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) fetchRoom();
  }, [roomId, fetchRoom]);

  if (loading) return <Spinner label="Loading room…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <ErrorState message={error} onRetry={fetchRoom} />
      </div>
    );
  }

  if (!room) return null;

  const gallery = [...new Set([room.image, ...(room.images || [])])].filter(
    Boolean,
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        to="/rooms"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all rooms
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* ---------------- Left: gallery + details ---------------- */}
        <div className="space-y-6">
          <div className="card-surface overflow-hidden">
            <SmartImage
              src={activeImage}
              alt={room.title}
              fallbackLabel={room.title}
              className="h-[300px] w-full object-cover sm:h-[420px]"
            />

            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto p-4">
                {gallery.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(src)}
                    className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                      activeImage === src
                        ? "ring-brand-500"
                        : "ring-transparent hover:ring-slate-300"
                    }`}
                  >
                    <SmartImage
                      src={src}
                      alt=""
                      fallbackLabel="Photo"
                      className="h-20 w-28 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card-surface space-y-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={room.status} />
                  {room.type && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {room.type}
                    </span>
                  )}
                </div>
                <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900">
                  {room.title}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {room.address}
                </p>
              </div>

              <Rating value={room.rating} showValue />
            </div>

            {room.description && (
              <p className="leading-relaxed text-slate-700">
                {room.description}
              </p>
            )}

            <div className="grid grid-cols-3 gap-3 border-y border-slate-100 py-5">
              {[
                { icon: Users, label: "Sleeps", value: room.maxGuests || 2 },
                { icon: BedDouble, label: "Beds", value: room.beds || 1 },
                { icon: Bath, label: "Bathrooms", value: room.bathrooms || 1 },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <Icon className="mx-auto h-5 w-5 text-brand-600" />
                  <p className="mt-2 font-display text-lg font-semibold text-slate-900">
                    {value}
                  </p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {room.amenities?.length > 0 && (
              <div>
                <h2 className="font-semibold text-slate-900">
                  What this place offers
                </h2>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {room.amenities.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <Check className="h-4 w-4 shrink-0 text-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl bg-sand-100 p-4 text-sm text-slate-600">
              <p>
                <strong className="font-semibold text-slate-800">
                  Check-in
                </strong>{" "}
                from {SITE.checkInTime} ·{" "}
                <strong className="font-semibold text-slate-800">
                  Check-out
                </strong>{" "}
                by {SITE.checkOutTime}
              </p>
              <p className="mt-1.5">
                Prices are per night and include taxes. Pay at the property.
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- Right: booking panel ---------------- */}
        <div className="lg:sticky lg:top-6">
          <div className="card-surface p-6">
            <p className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-slate-900">
                {formatCurrency(room.price)}
              </span>
              <span className="text-sm text-slate-500">/ night</span>
            </p>

            <div className="mt-5">
              <BookingForm
                kind="room"
                item={room}
                unitPrice={room.price}
                maxGuests={room.maxGuests || 2}
                disabled={room.status !== "available"}
                onSuccess={(booking) => navigate(`/booking/${booking.reference}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
