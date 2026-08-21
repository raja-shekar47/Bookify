import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquarePlus, Quote } from "lucide-react";
import API, { getErrorMessage } from "../services/api";
import PageHeader from "../components/PageHeader";
import Rating from "../components/Rating";
import { EmptyState, ErrorState, Spinner } from "../components/Feedback";
import { formatDate } from "../utils/format";
import { SITE } from "../config/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = { name: "", email: "", rating: 5, comment: "" };

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReviews = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setFormError("Please tell us your name.");
    if (!emailPattern.test(form.email.trim()))
      return setFormError("Enter a valid email address.");
    if (form.comment.trim().length < 10)
      return setFormError("Write at least a sentence about your stay.");

    try {
      setSubmitting(true);
      setFormError("");

      const { data } = await API.post("/reviews", {
        name: form.name.trim(),
        email: form.email.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
      });

      setReviews((prev) => [data, ...prev]);
      setForm(emptyForm);
      setFormOpen(false);
      setSuccess("Thanks for the review — it's now live on this page. 💚");
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not post your review."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <PageHeader
        eyebrow="Guest voices"
        title="Reviews"
        description={`What guests say after staying at ${SITE.name}.`}
        action={
          <button
            type="button"
            onClick={() => {
              setFormOpen((open) => !open);
              setSuccess("");
            }}
            className="btn-primary"
          >
            <MessageSquarePlus className="h-4 w-4" />
            {formOpen ? "Close" : "Write a review"}
          </button>
        }
      />

      {reviews.length > 0 && (
        <div className="card-surface flex flex-wrap items-center gap-6 p-6">
          <div>
            <p className="font-display text-4xl font-semibold text-slate-900">
              {average.toFixed(1)}
            </p>
            <Rating value={average} />
          </div>
          <div className="h-12 w-px bg-slate-200" />
          <p className="text-sm text-slate-600">
            Based on{" "}
            <strong className="font-semibold text-slate-900">
              {reviews.length}
            </strong>{" "}
            guest review{reviews.length > 1 ? "s" : ""}.
          </p>
        </div>
      )}

      {success && (
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 ring-1 ring-inset ring-brand-600/15">
          {success}
        </p>
      )}

      {/* ---------------- Review form ---------------- */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="card-surface animate-fade-up space-y-4 p-6"
          noValidate
        >
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Tell us about your stay
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="rv-name">
                Your name
              </label>
              <input
                id="rv-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="field-input"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="rv-email">
                Email
              </label>
              <input
                id="rv-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="field-input"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <span className="field-label">Rating</span>
            <Rating
              value={Number(form.rating)}
              size="h-7 w-7"
              onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="rv-comment">
              Your review
            </label>
            <textarea
              id="rv-comment"
              name="comment"
              rows={4}
              value={form.comment}
              onChange={handleChange}
              className="field-input resize-none"
              placeholder="The room was spotless and the kitchen made a big difference…"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {formError}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Posting…
              </>
            ) : (
              "Post review"
            )}
          </button>
        </form>
      )}

      {/* ---------------- Review list ---------------- */}
      {loading && <Spinner label="Loading reviews…" />}

      {!loading && error && <ErrorState message={error} onRetry={fetchReviews} />}

      {!loading && !error && reviews.length === 0 && (
        <EmptyState
          title="No reviews yet"
          description="Be the first guest to share how the stay went."
        />
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review._id} className="card-surface p-6">
              <Quote className="h-5 w-5 text-brand-300" />
              <p className="mt-3 leading-relaxed text-slate-700">
                {review.comment}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700">
                    {review.name?.charAt(0)?.toUpperCase() || "G"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {review.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(review.createdAt)}
                      {review.roomTitle ? ` · ${review.roomTitle}` : ""}
                    </p>
                  </div>
                </div>

                <Rating value={review.rating} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
