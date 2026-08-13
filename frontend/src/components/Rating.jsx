import { Star } from "lucide-react";

/** Read-only star row. Pass `onChange` to make it an input. */
const Rating = ({ value = 0, onChange, size = "h-4 w-4", showValue = false }) => {
  const interactive = typeof onChange === "function";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const icon = (
          <Star
            className={`${size} ${
              filled ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }`}
          />
        );

        return interactive ? (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            className="transition hover:scale-110"
          >
            {icon}
          </button>
        ) : (
          <span key={star}>{icon}</span>
        );
      })}

      {showValue && value > 0 && (
        <span className="ml-1 text-sm font-semibold text-slate-700">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
