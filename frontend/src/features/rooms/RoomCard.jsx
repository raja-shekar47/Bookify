import { Link } from "react-router-dom";
import { BedDouble, Bath, Users, MapPin, ArrowRight } from "lucide-react";
import SmartImage from "../../components/SmartImage";
import StatusBadge from "../../components/StatusBadge";
import Rating from "../../components/Rating";
import { formatCurrency } from "../../utils/format";

const RoomCard = ({ room }) => {
  const bookable = room.status === "available";

  return (
    <article className="card-surface group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)]">
      {/* Photo */}
      <div className="relative h-56 overflow-hidden">
        <SmartImage
          src={room.image}
          alt={room.title}
          fallbackLabel={room.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3">
          <StatusBadge status={room.status} className="bg-white/95 backdrop-blur" />
        </div>

        {room.type && (
          <span className="absolute right-3 top-3 rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {room.type}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight text-slate-900">
            {room.title}
          </h3>
          <Rating value={room.rating} size="h-3.5 w-3.5" showValue />
        </div>

        {room.address && (
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{room.address}</span>
          </p>
        )}

        {room.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {room.description}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {room.maxGuests || 2} guests
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" /> {room.beds || 1} bed
            {(room.beds || 1) > 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5" /> {room.bathrooms || 1} bath
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="leading-tight">
            <span className="font-display text-xl font-semibold text-slate-900">
              {formatCurrency(room.price)}
            </span>
            <span className="block text-xs text-slate-500">per night</span>
          </p>

          <Link
            to={`/rooms/${room._id}`}
            className={
              bookable
                ? "btn-primary px-4 py-2.5"
                : "btn-ghost px-4 py-2.5"
            }
          >
            {bookable ? "Book now" : "View"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
