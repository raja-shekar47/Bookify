import { useCallback, useEffect, useMemo, useState } from "react";
import API, { getErrorMessage } from "../../services/api";
import RoomCard from "./RoomCard";
import { CardSkeletonGrid, EmptyState, ErrorState } from "../../components/Feedback";
import { useSearch } from "../../context/searchStore";

const FILTERS = [
  { key: "all", label: "All rooms" },
  { key: "available", label: "Available" },
  { key: "Family Suite", label: "Family suites" },
  { key: "Deluxe Room", label: "Deluxe" },
  { key: "Standard Room", label: "Standard" },
  { key: "Apartment", label: "Apartments" },
];

/**
 * @param {number} [limit]      cap the number of cards shown
 * @param {boolean} [showFilters]
 * @param {boolean} [respectSearch] hide rooms too small for the party size
 */
const RoomList = ({ limit, showFilters = true, respectSearch = false }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const { criteria } = useSearch();

  const fetchRooms = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const visibleRooms = useMemo(() => {
    let list = rooms;

    if (filter === "available") {
      list = list.filter((room) => room.status === "available");
    } else if (filter !== "all") {
      list = list.filter((room) => room.type === filter);
    }

    if (respectSearch && criteria.guests) {
      list = list.filter(
        (room) => (room.maxGuests || 2) >= Number(criteria.guests),
      );
    }

    return limit ? list.slice(0, limit) : list;
  }, [rooms, filter, limit, respectSearch, criteria.guests]);

  if (loading) return <CardSkeletonGrid count={limit || 3} />;

  if (error) return <ErrorState message={error} onRetry={fetchRooms} />;

  return (
    <div className="space-y-6">
      {showFilters && rooms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === key
                  ? "bg-slate-900 text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {visibleRooms.length === 0 ? (
        <EmptyState
          title="No rooms match this filter"
          description={
            respectSearch
              ? `We don't have a room for ${criteria.guests} guests under this filter. Try fewer guests or clear the filter.`
              : "Add rooms from the admin console, or pick a different filter."
          }
          action={
            filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="btn-ghost"
              >
                Clear filter
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleRooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
