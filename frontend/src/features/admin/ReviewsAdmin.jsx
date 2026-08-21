import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import API, { getErrorMessage } from "../../services/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import Rating from "../../components/Rating";
import { EmptyState, ErrorState, Spinner } from "../../components/Feedback";
import { formatDate } from "../../utils/format";

const ReviewsAdmin = ({ onChanged }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/reviews");
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load reviews."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/reviews/${deleteTarget._id}`);
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
      onChanged?.();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the review."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading reviews…" />;

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Reviews guests post on the public Reviews page show up here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        <strong className="font-semibold text-slate-900">
          {reviews.length}
        </strong>{" "}
        review{reviews.length === 1 ? "" : "s"} published
      </p>

      {reviews.map((review) => (
        <div
          key={review._id}
          className="card-surface flex items-start justify-between gap-4 p-5"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-semibold text-slate-900">{review.name}</p>
              <Rating value={review.rating} size="h-3.5 w-3.5" />
              <span className="text-xs text-slate-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {review.comment}
            </p>
            <p className="mt-2 text-xs text-slate-400">{review.email}</p>
          </div>

          <button
            type="button"
            onClick={() => setDeleteTarget(review)}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Delete review by ${review.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this review?"
        message={`The review by ${deleteTarget?.name} will be removed from the public page.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </div>
  );
};

export default ReviewsAdmin;
