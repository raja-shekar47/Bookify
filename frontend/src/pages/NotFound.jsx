import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const NotFound = () => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
      <Compass className="h-7 w-7" />
    </span>
    <h1 className="font-display text-3xl font-semibold text-slate-900">
      Took a wrong turn
    </h1>
    <p className="text-sm text-slate-600">
      That page doesn't exist. Let's get you back to the rooms.
    </p>
    <Link to="/" className="btn-primary mt-2">
      Back to home
    </Link>
  </div>
);

export default NotFound;
