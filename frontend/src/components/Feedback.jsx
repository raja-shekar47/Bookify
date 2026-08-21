import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export const Spinner = ({ label = "Loading…", className = "" }) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 py-16 text-slate-500 ${className}`}
  >
    <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="card-surface flex flex-col items-center gap-3 px-6 py-12 text-center">
    <AlertCircle className="h-8 w-8 text-rose-500" />
    <p className="text-sm font-medium text-slate-700">{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-ghost mt-2">
        Try again
      </button>
    )}
  </div>
);

export const EmptyState = ({ title, description, action }) => (
  <div className="card-surface flex flex-col items-center gap-2 px-6 py-14 text-center">
    <Inbox className="h-8 w-8 text-slate-300" />
    <p className="font-semibold text-slate-800">{title}</p>
    {description && (
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
    )}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

/** Skeleton grid used while cards are loading. */
export const CardSkeletonGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card-surface overflow-hidden">
        <div className="h-52 animate-pulse bg-slate-200" />
        <div className="space-y-3 p-5">
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-9 w-full animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    ))}
  </div>
);
